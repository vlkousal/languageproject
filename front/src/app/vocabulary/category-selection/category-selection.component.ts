import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Category} from "../../constants";

@Component({
  selector: 'app-category-selection',
  templateUrl: './category-selection.component.html',
  styleUrls: ['./category-selection.component.css']
})
export class CategorySelectionComponent {

    @Input() categories: Category[] | undefined;
    selectedCategory: Category | null = null;

    @Output()
    onContinue: EventEmitter<Category> = new EventEmitter<Category>();

    goNext(): void {
        if(this.selectedCategory != null) this.onContinue.emit(this.selectedCategory);
    }
}
