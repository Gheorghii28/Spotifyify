import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-custom-button',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.scss'
})
export class CustomButtonComponent {
  @Input() icon!: string;
  @Input() text!: string;
  @Input() customClass!: string;
  @Input() sidenavExpanded!: boolean;
  @Output() clickEvent = new EventEmitter<void>();

  handleClick() {
    this.clickEvent.emit();
  }
}
