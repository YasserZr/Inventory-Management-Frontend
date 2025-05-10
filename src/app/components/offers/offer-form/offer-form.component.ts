import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-offer-form',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './offer-form.component.html',
  styleUrl: './offer-form.component.scss'
})
export class OfferFormComponent {
  constructor() {
    console.log('OfferFormComponent initialized');
  }
}
