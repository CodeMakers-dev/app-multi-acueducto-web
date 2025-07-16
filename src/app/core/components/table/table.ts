import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { TableColumn } from '@interfaces/ItableColumn';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table implements OnInit {

  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actionsTemplate: TemplateRef<any> | null = null;

  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();

  


  currentSortColumn: string = '';
  currentSortDirection: 'asc' | 'desc' = 'asc';


  public Math = Math;

  ngOnInit(): void {
    
    console.log('Table Component - ngOnInit - Received Data:', this.data);
    console.log('Table Component - ngOnInit - Received Columns:', this.columns);
    console.log('Table Component - ngOnInit - Total Items:', this.totalItems);

    if (this.totalItems === 0 && this.data) {
      this.totalItems = this.data.length;
    }
  }

 

  getNestedProperty(obj: any, path: string): any {
    // console.log(`Attempting to get property: ${path} from object:`, obj);
    if (!obj || !path) {
      // console.log(`getNestedProperty - Invalid input: obj=${obj}, path=${path}`);
      return '';
    }
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // console.log(`  Processing part: ${part}. Current object:`, current);
      if (current === null || typeof current === 'undefined' || typeof current !== 'object' || !current.hasOwnProperty(part)) {
        return '';
      }
      current = current[part];
    }
    return current;
  }

  trackById(index: number, item: any): any {
    return item.id || index;
  }

  toggleSort(columnKey: string): void {
    if (!this.columns.find(col => col.key === columnKey)?.sortable) {
      return;
    }

    if (this.currentSortColumn === columnKey) {
      this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortColumn = columnKey;
      this.currentSortDirection = 'asc';
    }
    this.sortChange.emit({ column: this.currentSortColumn, direction: this.currentSortDirection });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }
}
