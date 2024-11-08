import { Component, input } from '@angular/core';

@Component({
  selector: 'app-toastr',
  standalone: true,
  imports: [],
  templateUrl: './toastr.component.html',
  styleUrl: './toastr.component.scss',
})
export class ToastrComponent {
  errorMessage = input.required<string>();
}
