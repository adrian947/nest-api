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
    console.log("🚀 ~ token:", token)
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
    console.log('connected clients', this.messagesWsService.getConnectedClients())
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients().map((idSocket: string) => (
      this.messagesWsService.getUserFullNameBySocketId(idSocket)
    )))

  }
  handleDisconnect(client: Socket) {
    // console.log('cliente disconnet', client.id)
    this.messagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients().map((idSocket: string) => (
      this.messagesWsService.getUserFullNameBySocketId(idSocket)
    )))
    console.log('Disconnect clients', this.messagesWsService.getConnectedClients())
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {

    console.log("🚀 ~ client.id:", client.id)
    const user = this.messagesWsService.getUserFullNameBySocketId(client.id)
    console.log("🚀 ~ user:", user)
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
      fullName: user,
      message: payload.message
    })
  }

}
