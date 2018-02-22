import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Mensaje } from '../interface/mensaje.interface';

@Injectable()
export class ChatService {

  private chatsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe( user => {
          console.log(user);
          if (!user) {
            return;
          } else {
            this.usuario.nombre = user.displayName;
            this.usuario.uid = user.uid;
          }
    });
  }

  login(proveedor: string) {
    if (proveedor === 'google') {
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } else {
      // Falta habilitar el proveedor en firebase
      this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }
  }

  logout() {
    console.log('logout');
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  cargarMensajes() {
    this.chatsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc')
                                                                          .limit(5));

    return this.chatsCollection.valueChanges()
                                .map( (mensajes: Mensaje[]) => {
                                console.log('service', mensajes);
                                this.chats = [];
                                for (let mensaje of mensajes) {
                                  this.chats.unshift( mensaje);
                                }
                                return this.chats;
                                });
  }

  agreagarMensaje(texto: string) {
    // falta uid
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };
    return this.chatsCollection.add( mensaje );
  }
}
