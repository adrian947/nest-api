import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true})
export class MessagesWsGateway  implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly messagesWsService: MessagesWsService) {}
 
 
  handleConnection(client: Socket) {
    console.log('Cliente conected', client.id)
    this.messagesWsService.registerClient(client)
    console.log('connected clients', this.messagesWsService.getConnectedClients())
  }
  handleDisconnect(client: Socket) {
    // console.log('cliente disconnet', client.id)
    this.messagesWsService.removeClient(client.id)
    console.log('connected clients', this.messagesWsService.getConnectedClients())
  }
}