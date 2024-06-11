import {
  AfterContentChecked,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
} from "@angular/core";
import { TabDirective } from "../../directives/tab.directive";
import { NgClass, NgTemplateOutlet } from "@angular/common";

@Component({
  selector: "app-tabs",
  standalone: true,
  imports: [NgTemplateOutlet, NgClass],
  templateUrl: "./tabs.component.html",
  styleUrl: "./tabs.component.css",
})
export class TabsComponent implements AfterContentChecked {
  // getting all tabs by directive
  @ContentChildren(TabDirective) tabs!: QueryList<TabDirective>;

  // event emitter to trigger the handling of deleting/closing a tab
  @Output() tabDeleted: EventEmitter<string> = new EventEmitter();

  protected activeTab!: TabDirective;

  ngAfterContentChecked(): void {
    if (!this.activeTab) this.activeTab = this.tabs.first;
  }

  protected showTabContent(tab: TabDirective): void {
    this.activeTab = tab;
  }

  protected deleteTab(tabId: string): void {
    this.tabDeleted.emit(tabId);
    if (this.activeTab.id == tabId)
      this.activeTab = this.tabs.filter((tab) => tab.id !== tabId)[0];
  }
}
