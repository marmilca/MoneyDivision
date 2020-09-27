import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Person } from 'src/Models/Person';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  personCount: number;

  personList = new Array<Person>();
  hasPerson: boolean = false;

  incrementId:number= 1;
  pushList() {
    console.log(this.personCount);
    if (this.personCount > 0) {
      this.hasPerson = true;

      for (let index = 0; index < this.personCount; index++) {
        var person = <Person>{
          id: this.incrementId
        }

        this.incrementId++;
        this.personList.push(person);
      }
     
    } else this.hasPerson = false;
  }

  calculate() {
    console.log(1234, this.personList);
  }
}
