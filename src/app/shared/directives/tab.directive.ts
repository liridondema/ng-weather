import { Directive, Input, TemplateRef, inject } from "@angular/core";

@Directive({
  standalone: true,
  selector: "[appTab]",
})
export class TabDirective {
  // directive for dynamic selecting in tab component
  @Input({ required: true }) id!: string;
  @Input({ required: true }) title!: string;

  public templateRef = inject(TemplateRef<unknown>);
}
