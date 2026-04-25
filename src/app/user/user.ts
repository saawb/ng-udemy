import { Component } from '@angular/core';
import { DUMMY_USERS } from '../dummy-users'

// const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length)

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  users = DUMMY_USERS;
  imagePath = 'assets/users/';

  onSelectUser () {
    console.log('Clicked')
  }
}
