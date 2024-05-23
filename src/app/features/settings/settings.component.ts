import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ec-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsComponent {}
