import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatComponent } from '../chat/chat.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {

  constructor(public _cs: ChatService) { }

  ingresar(proveedor: string) {
    console.log(proveedor);

    this._cs.login(proveedor);
  }

}
