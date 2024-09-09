import { Component, OnInit } from '@angular/core';

export interface Reservation {
  courtId: number;
  timeSlot: string;
  price: number;
  date: string;
}

export interface Court {
  id: number;
  name: string;
}

@Component({
  selector: 'app-calendario_reserva',
  templateUrl: './calendario_reserva.component.html',
  styleUrl: './calendario_reserva.component.css'
})
export class CalendarioReservaComponent implements OnInit {
  selectedDate: string = new Date().toISOString().split('T')[0];
  minDate: string = this.getMinDate();
  currentHour: number = new Date().getHours();

  // Intervalos de tiempo disponibles
  timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  // Canchas disponibles
  courts: Court[] = [
    { id: 1, name: 'Cancha 1' },
    { id: 2, name: 'Cancha 2' },
    { id: 3, name: 'Cancha 3' },
    { id: 4, name: 'Cancha 4' }
  ];

  // Reservas existentes
  reservations: Reservation[] = [
    { courtId: 1, timeSlot: '08:00', price: 20000, date: '2024-08-21' },
    { courtId: 1, timeSlot: '11:00', price: 20000, date: '2024-08-21' },
    { courtId: 2, timeSlot: '14:00', price: 20000, date: '2024-08-22' },
    { courtId: 3, timeSlot: '20:00', price: 20000, date: '2024-08-22' },
    { courtId: 3, timeSlot: '21:00', price: 20000, date: '2024-08-22' },
  ];

  // Tooltip
  tooltipVisible = false;
  tooltipCourt: Court | null = null;
  tooltipSlot: string = '';
  tooltipPrice: string = '';
  tooltipPosition = { top: 0, left: 0 };

  // Menú de opciones
  showOptionsMenu = false;
  optionsMenuPosition = { top: 0, left: 0 };
  highlightedCells: { courtId: number, slot: string }[] = [];
  halfHighlightedCell: { courtId: number, slot: string } | null = null;

  ngOnInit() {
    this.loadReservations(this.selectedDate);
  }

  getMinDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  loadReservations(date: string) {
    // Implementar lógica de carga de reservas según la fecha
  }

  makeReservation(courtId: number, timeSlot: string, date: string, price: number): void {
    // Implementar el envío de la reserva al backend
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.minDate = this.getMinDate(); // Actualiza la fecha mínima
    this.loadReservations(this.selectedDate);
  }

  showTooltip(event: MouseEvent, court: Court, slot: string) {
    this.tooltipCourt = court;
    this.tooltipSlot = slot;
    this.tooltipPrice = '20000'; // Ejemplo de precio fijo, puede variar según la lógica
    this.tooltipPosition.top = event.clientY + 15;
    this.tooltipPosition.left = event.clientX + 15;
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  showTimeOptions(court: Court, slot: string, event: MouseEvent) {
    this.highlightedCells = [{ courtId: court.id, slot }];
    this.halfHighlightedCell = null;

    const target = event.target as HTMLTableCellElement;
    this.optionsMenuPosition.top = target.offsetTop + target.offsetHeight;
    this.optionsMenuPosition.left = target.offsetLeft;
    this.showOptionsMenu = true;
  }

//  opciones tiempo
  selectOption(duration: number) {
    const courtId = this.highlightedCells[0].courtId;
    const slotIndex = this.timeSlots.indexOf(this.highlightedCells[0].slot);

    this.highlightedCells = [];
    this.halfHighlightedCell = null;

    if (duration === 90) {
      this.highlightedCells.push({ courtId, slot: this.timeSlots[slotIndex] });
      if (this.timeSlots[slotIndex + 1]) {
        this.halfHighlightedCell = { courtId, slot: this.timeSlots[slotIndex + 1] };
      }
    } else if (duration === 120) {
      this.highlightedCells.push({ courtId, slot: this.timeSlots[slotIndex] });
      if (this.timeSlots[slotIndex + 1]) {
        this.highlightedCells.push({ courtId, slot: this.timeSlots[slotIndex + 1] });
      }
    } else if (duration === 150) {
      this.highlightedCells.push({ courtId, slot: this.timeSlots[slotIndex] });
      if (this.timeSlots[slotIndex + 1]) {
        this.highlightedCells.push({ courtId, slot: this.timeSlots[slotIndex + 1] });
      }
      if (this.timeSlots[slotIndex + 2]) {
        this.halfHighlightedCell = { courtId, slot: this.timeSlots[slotIndex + 2] };
      }
    }

    this.showOptionsMenu = false;
  }

  isHighlighted(courtId: number, slot: string): boolean {
    return this.highlightedCells.some(cell => cell.courtId === courtId && cell.slot === slot);
  }

  isHalfHighlighted(courtId: number, slot: string): boolean {
    return this.halfHighlightedCell !== null && this.halfHighlightedCell.courtId === courtId && this.halfHighlightedCell.slot === slot;
  }

  isPastTime(slot: string): boolean {
    const [hour, minute] = slot.split(':').map(Number);
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    if (this.selectedDate < this.minDate) {
      return true; // Si la fecha seleccionada es antes de la fecha mínima, marcar como pasada.
    }

    if (this.selectedDate === this.minDate) {
      return hour < currentHour || (hour === currentHour && minute <= currentMinute);
    }

    return false; 
  }

  isReserved(courtId: number, slot: string): boolean {
    return this.reservations.some(
      res => res.courtId === courtId && res.timeSlot === slot && res.date === this.selectedDate
    );
  }
}
