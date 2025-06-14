import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  isSelectOpen1 = false;
  isSelectOpen2 = false;
  public selectedFileName: string = 'No file chosen';

  toggleSelectOpen1() {
    this.isSelectOpen1 = !this.isSelectOpen1;
  }

  toggleSelectOpen2() {
    this.isSelectOpen2 = !this.isSelectOpen2;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      document.getElementById("fileName")!.textContent = file.name;
    } else {
      this.selectedFileName = 'No file chosen';
      document.getElementById("fileName")!.textContent = 'No file chosen';
    }
  }
}
