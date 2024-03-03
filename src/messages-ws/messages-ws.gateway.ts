import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,

    private readonly jwtService: JwtService,

  ) { }

  validateToken(client: Socket) {
    const token = client.handshake.headers.authentication as string
    try {
      const valid = this.jwtService.verify(token);

      return valid.id
    } catch (error) {
      this.handleDisconnect(client);
      console.log("🚀 ~ error:", error)
    }
  }

  async handleConnection(client: Socket) {
    const userId = this.validateToken(client)
    if (!userId) {
      this.handleDisconnect(client);
    }

    await this.messagesWsService.registerClient(client, userId)

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients().map((idSocket: string) => (
      this.messagesWsService.getUserFullNameAndSocketId(idSocket)
    )))

  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients().map((idSocket: string) => (
      this.messagesWsService.getUserFullNameAndSocketId(idSocket)
    )))
    console.log('Disconnect clients', this.messagesWsService.getConnectedClients())
  }

  //! Este método se invocará cuando desees enviar un mensaje a un socket específico.
  sendToSocket(socketId: string, message: string, fullname: string) {
    const socket = this.wss.sockets.sockets.get(socketId);

    if (socket) {
      socket.emit('message-from-server', {
        fullName: fullname,
        message: message
      })
    } else {
      console.error(`Socket not found: ${socketId}`);
    }
  }


  @SubscribeMessage('send-message-to-client')
  handleMessage(client: Socket, payload: any) {
    const userAndSocket = this.messagesWsService.getUserFullNameAndSocketId(client.id)

    client.emit('message-from-server', {
      fullName: userAndSocket.fullname,
      message: payload.message
    })

    const targetSocketId = payload.id;
    const messageToTargetSocket = payload.message;
    const fullname = userAndSocket.fullname;
    this.sendToSocket(targetSocketId, messageToTargetSocket, fullname);
  }


  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    const userAndSocket = this.messagesWsService.getUserFullNameAndSocketId(client.id)
    //! emite unicamente al cliente que envia el mensaje
    // client.emit('message-from-server',{
    //   fullName: 'Soy yo!',
    //   message: payload.message
    // })

    //! emitir a todos menos al cliente que envia el mensaje
    // client.broadcast.emit('message-from-server',{
    //   fullName: 'Soy yo!',
    //   message: payload.message
    // })

    //! emitir a todos incluyendome a mi
    this.wss.emit('message-from-server', {
      fullName: userAndSocket.fullname,
      message: payload.message
    })
  }

}
