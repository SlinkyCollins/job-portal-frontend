import { CommonModule } from "@angular/common"
import { Component, EventEmitter, Input, Output } from "@angular/core"

@Component({
  selector: "app-delete-account",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./deleteaccount.component.html",
  styleUrls: ["./deleteaccount.component.css"],
})
export class DeleteaccountComponent {
  @Input() showModal = false
  @Input() title = "Are you sure?"
  @Input() description = "Are you sure to delete your account? All data will be lost."
  @Input() confirmButtonText = "Yes"
  @Input() cancelButtonText = "Cancel"

  @Output() confirmed = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  onConfirm(): void {
    this.confirmed.emit()
  }

  onCancel(): void {
    this.cancelled.emit()
  }
}
