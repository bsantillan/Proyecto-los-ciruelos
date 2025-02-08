

import { Component, OnInit, HostListener, ElementRef } from '@angular/core';

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
  price: number = 15000;

  timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
  ];

  courts: Court[] = [
    { id: 1, name: 'Cancha 1' },
    { id: 2, name: 'Cancha 2' },
    { id: 3, name: 'Cancha 3' },
    { id: 4, name: 'Cancha 4' }
  ];

  reservations: Reservation[] = [
    { courtId: 1, timeSlot: '08:00', price: 20000, date: '2024-08-21' },
    { courtId: 1, timeSlot: '11:00', price: 20000, date: '2024-08-21' },
    { courtId: 2, timeSlot: '14:00', price: 20000, date: '2024-08-22' },
    { courtId: 3, timeSlot: '20:00', price: 20000, date: '2024-08-22' },
    { courtId: 3, timeSlot: '21:00', price: 20000, date: '2024-08-22' },
  ];

  showOptionsMenu = false;
  optionsMenuPosition = { top: 0, left: 0 };
  highlightedCells: { courtId: number, slot: string }[] = [];
  halfHighlightedCell: { courtId: number, slot: string } | null = null;
  lastHighlightedCell: { courtId: number, slot: string } | null = null; // Nueva propiedad para la última celda resaltada

  constructor(private elementRef: ElementRef) {}

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

  loadReservations(date: string) {}

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.minDate = this.getMinDate();
    this.loadReservations(this.selectedDate);
    this.clearSelectedCells();
    this.hideOptionsMenu();
  }

  clearSelectedCells(): void {
    this.highlightedCells = [];
    this.halfHighlightedCell = null;
  }

  hideOptionsMenu(): void {
    this.showOptionsMenu = false;
    this.clearSelectedCells(); // Limpia la selección si el menú se cierra sin elegir
  }
  

  showTimeOptions(court: Court, slot: string, event: MouseEvent) {
    this.highlightedCells = []; // Limpiar selección previa
  
    const slotIndex = this.timeSlots.indexOf(slot);
  
    if (slotIndex !== -1) {
      this.highlightedCells.push({ courtId: court.id, slot });
  
      // Verificar si hay un siguiente slot disponible y resaltarlo también
      if (slotIndex + 1 < this.timeSlots.length) {
        this.highlightedCells.push({ courtId: court.id, slot: this.timeSlots[slotIndex + 1] });
      }
    }
  
    // Obtener posición del menú
    const target = event.target as HTMLTableCellElement;
    const rect = target.getBoundingClientRect();
  
    this.optionsMenuPosition = {
      top: rect.top + window.scrollY + target.offsetHeight,
      left: rect.left + window.scrollX + rect.width / 2 - 100
    };
  
    this.showOptionsMenu = true;
  }  

  previewOption(duration: number) {
    const courtId = this.highlightedCells.length > 0 ? this.highlightedCells[0].courtId : null;
    if (!courtId) return;
  
    const slotIndex = this.timeSlots.indexOf(this.highlightedCells[0].slot);
    if (slotIndex === -1) return;
  
    this.clearHighlightedCells(); // Limpia la selección previa
  
    let slotsToHighlight = 0;
  
    if (duration === 90) {
      slotsToHighlight = 2; // 2 celdas
    } else if (duration === 120) {
      slotsToHighlight = 3; // 3 celdas
    } else if (duration === 150) {
      slotsToHighlight = 4; // 4 celdas
    }
  
    for (let i = 0; i < slotsToHighlight; i++) {
      if (this.timeSlots[slotIndex + i]) {
        this.highlightedCells.push({ courtId, slot: this.timeSlots[slotIndex + i] });
      }
    }
  
    // Marca la última celda resaltada
    if (this.highlightedCells.length > 0) {
      this.lastHighlightedCell = this.highlightedCells[this.highlightedCells.length - 1];
    }
  }  

  clearHighlightedCells(): void {
    // Limpia las celdas resaltadas y la media celda resaltada
    this.highlightedCells = [];
    this.halfHighlightedCell = null;
  }  

  isHighlighted(courtId: number, slot: string): boolean {
    return this.highlightedCells.some(cell => cell.courtId === courtId && cell.slot === slot);
  }
  
  isHalfHighlighted(courtId: number, slot: string): boolean {
    return this.halfHighlightedCell !== null && this.halfHighlightedCell.courtId === courtId && this.halfHighlightedCell.slot === slot;
  }
  
  isFirstHighlighted(courtId: number, slot: string): boolean {
    const firstCell = this.highlightedCells[0];
    return firstCell && firstCell.courtId === courtId && firstCell.slot === slot;
  }
  
  isLastHighlighted(courtId: number, slot: string): boolean {
    const lastCell = this.highlightedCells[this.highlightedCells.length - 1];
    return lastCell && lastCell.courtId === courtId && lastCell.slot === slot;
  }

  isPastTime(slot: string, ): boolean {
    const [hour, minute] = slot.split(':').map(Number);
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (this.selectedDate < this.minDate) {
      return true;
    }

    if (this.selectedDate === this.minDate) {
      return hour < currentHour || (hour === currentHour && minute <= currentMinute);
    }

    return false;
  }

  isFirstPastTime(slot: string): boolean {
    // Aquí puedes calcular la primera fecha pasada
    return this.isPastTime(slot) && this.timeSlots.indexOf(slot) === 0;
  }

  isLastPastTime(slot: string): boolean {
    const [hour, minute] = slot.split(':').map(Number);
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
  
    // Si la fecha seleccionada es anterior a la fecha actual, cualquier hora es pasada
    if (this.selectedDate < this.minDate) {
      return true;
    }
  
    // Si la fecha seleccionada es hoy, verificamos si el slot ya es pasado
    if (this.selectedDate === this.minDate) {
      const isPast = hour < currentHour || (hour === currentHour && minute <= currentMinute);
      if (isPast) {
        // Filtrar los slots pasados
        const pastSlots = this.timeSlots.filter(t => {
          const [tHour, tMinute] = t.split(':').map(Number);
          return tHour < currentHour || (tHour === currentHour && tMinute <= currentMinute);
        });
  
        // Obtener el último slot pasado de la lista
        const lastPastSlot = pastSlots[pastSlots.length - 1];
  
        // Si el slot actual es el último slot pasado
        return slot === lastPastSlot;
      }
    }
  
    return false;
  }

  isReserved(courtId: number, slot: string): boolean {
    return this.reservations.some(
      res => res.courtId === courtId && res.timeSlot === slot && res.date === this.selectedDate
    );
  }

  // Detectar clics en todo el documento y cerrar el menú si se hace clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.hideOptionsMenu();
    }
  }
}
