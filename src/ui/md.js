import * as React from "react";
import { createComponent } from "@lit/react";

import { MdFilledButton } from "@material/web/button/filled-button.js";
import { MdFilledTonalButton } from "@material/web/button/filled-tonal-button.js";
import { MdOutlinedButton } from "@material/web/button/outlined-button.js";
import { MdTextButton } from "@material/web/button/text-button.js";
import { MdElevatedButton } from "@material/web/button/elevated-button.js";
import { MdIconButton } from "@material/web/iconbutton/icon-button.js";
import { MdFilledIconButton } from "@material/web/iconbutton/filled-icon-button.js";
import { MdFilledTonalIconButton } from "@material/web/iconbutton/filled-tonal-icon-button.js";
import { MdFab } from "@material/web/fab/fab.js";
import { MdBrandedFab } from "@material/web/fab/branded-fab.js";
import { MdFilledTextField } from "@material/web/textfield/filled-text-field.js";
import { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field.js";
import { MdFilledSelect } from "@material/web/select/filled-select.js";
import { MdOutlinedSelect } from "@material/web/select/outlined-select.js";
import { MdSelectOption } from "@material/web/select/select-option.js";
import { MdChipSet } from "@material/web/chips/chip-set.js";
import { MdAssistChip } from "@material/web/chips/assist-chip.js";
import { MdFilterChip } from "@material/web/chips/filter-chip.js";
import { MdInputChip } from "@material/web/chips/input-chip.js";
import { MdSuggestionChip } from "@material/web/chips/suggestion-chip.js";
import { MdSwitch } from "@material/web/switch/switch.js";
import { MdCheckbox } from "@material/web/checkbox/checkbox.js";
import { MdRadio } from "@material/web/radio/radio.js";
import { MdList } from "@material/web/list/list.js";
import { MdListItem } from "@material/web/list/list-item.js";
import { MdTabs } from "@material/web/tabs/tabs.js";
import { MdPrimaryTab } from "@material/web/tabs/primary-tab.js";
import { MdSecondaryTab } from "@material/web/tabs/secondary-tab.js";
import { MdCircularProgress } from "@material/web/progress/circular-progress.js";
import { MdLinearProgress } from "@material/web/progress/linear-progress.js";
import { MdMenu } from "@material/web/menu/menu.js";
import { MdMenuItem } from "@material/web/menu/menu-item.js";
import { MdDivider } from "@material/web/divider/divider.js";
import { MdRipple } from "@material/web/ripple/ripple.js";
import { MdElevation } from "@material/web/elevation/elevation.js";
import { MdFocusRing } from "@material/web/focus/md-focus-ring.js";

const wrap = (tagName, elementClass, events) =>
  createComponent({ react: React, tagName, elementClass, events });

export const FilledButton = wrap("md-filled-button", MdFilledButton);
export const TonalButton = wrap("md-filled-tonal-button", MdFilledTonalButton);
export const OutlinedButton = wrap("md-outlined-button", MdOutlinedButton);
export const TextButton = wrap("md-text-button", MdTextButton);
export const ElevatedButton = wrap("md-elevated-button", MdElevatedButton);

export const PlainIconButton = wrap("md-icon-button", MdIconButton);
export const FilledIconButton = wrap(
  "md-filled-icon-button",
  MdFilledIconButton,
);
export const TonalIconButton = wrap(
  "md-filled-tonal-icon-button",
  MdFilledTonalIconButton,
);

export const Fab = wrap("md-fab", MdFab);
export const BrandedFab = wrap("md-branded-fab", MdBrandedFab);

export const FilledTextField = wrap(
  "md-filled-text-field",
  MdFilledTextField,
  { onInput: "input", onChange: "change" },
);
export const OutlinedTextField = wrap(
  "md-outlined-text-field",
  MdOutlinedTextField,
  { onInput: "input", onChange: "change" },
);

export const FilledSelect = wrap("md-filled-select", MdFilledSelect, {
  onChange: "change",
  onInput: "input",
});
export const OutlinedSelect = wrap("md-outlined-select", MdOutlinedSelect, {
  onChange: "change",
  onInput: "input",
});
export const SelectOption = wrap("md-select-option", MdSelectOption);

export const ChipSet = wrap("md-chip-set", MdChipSet);
export const AssistChip = wrap("md-assist-chip", MdAssistChip);
export const FilterChip = wrap("md-filter-chip", MdFilterChip);
export const InputChip = wrap("md-input-chip", MdInputChip, {
  onRemove: "remove",
});
export const SuggestionChip = wrap("md-suggestion-chip", MdSuggestionChip);

export const Switch = wrap("md-switch", MdSwitch, { onChange: "change" });
export const Checkbox = wrap("md-checkbox", MdCheckbox, {
  onChange: "change",
  onInput: "input",
});
export const Radio = wrap("md-radio", MdRadio, { onChange: "change" });

export const List = wrap("md-list", MdList);
export const ListItem = wrap("md-list-item", MdListItem);

export const Tabs = wrap("md-tabs", MdTabs, { onChange: "change" });
export const PrimaryTab = wrap("md-primary-tab", MdPrimaryTab);
export const SecondaryTab = wrap("md-secondary-tab", MdSecondaryTab);

export const CircularProgress = wrap(
  "md-circular-progress",
  MdCircularProgress,
);
export const LinearProgress = wrap("md-linear-progress", MdLinearProgress);

export const Menu = wrap("md-menu", MdMenu, {
  onOpening: "opening",
  onClosed: "closed",
});
export const MenuItem = wrap("md-menu-item", MdMenuItem);

export const Divider = wrap("md-divider", MdDivider);
export const Ripple = wrap("md-ripple", MdRipple);
export const Elevation = wrap("md-elevation", MdElevation);
export const FocusRing = wrap("md-focus-ring", MdFocusRing);
