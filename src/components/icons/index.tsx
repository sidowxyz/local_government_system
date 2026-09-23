import type React from 'react';
import {
  Bank,
  Tray,
  File,
  FilePlus,
  ClipboardText,
  NotePencil,
  UsersThree,
  CaretDown,
  CaretUp,
  CaretUpDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MagnifyingGlass,
  Plus,
  X,
  FloppyDisk,
  Paperclip,
  Printer,
  DownloadSimple,
  Money,
  PaperPlaneTilt,
  PencilSimple,
  GitMerge,
  Scissors,
  UserPlus,
  UserCheck,
  IdentificationCard,
  CheckCircle,
  Check,
  WarningCircle,
  Info,
  Buildings,
  Baby,
  Car,
  Certificate,
  Receipt,
  Trash,
  MapPin,
  ShieldCheck,
  SidebarSimple,
  type IconProps as PhosphorIconProps,
} from '@phosphor-icons/react';

// ---------- shared prop interface ----------
// Keeps the same API surface the rest of the app already uses:
//   <SomeIcon className="…" strokeWidth={1.75} />
// strokeWidth is silently ignored (Phosphor uses `weight` instead),
// but we accept it so existing call-sites don't break.

export interface IconComponentProps {
  className?: string;
  strokeWidth?: number | string;   // compat – ignored
  weight?: PhosphorIconProps['weight'];
  size?: number | string;
}

export type IconComponent = React.ComponentType<IconComponentProps>;

// ---------- factory ----------
function wrap(
  PhosphorComp: React.ComponentType<PhosphorIconProps>,
): IconComponent {
  return function WrappedIcon({ className, weight = 'regular', size }: IconComponentProps) {
    return <PhosphorComp className={className} weight={weight} size={size} />;
  };
}

// ---------- Landmark & Navigation ----------
export const LandmarkIcon   = wrap(Bank);
export const InboxIcon      = wrap(Tray);
export const FileTextIcon   = wrap(File);
export const FilePlus2Icon  = wrap(FilePlus);
export const ClipboardTextIcon = wrap(ClipboardText);
export const NotePencilIcon = wrap(NotePencil);
export const UsersIcon      = wrap(UsersThree);

// ---------- Directional & Chevrons ----------
export const ChevronDownIcon    = wrap(CaretDown);
export const ChevronUpIcon      = wrap(CaretUp);
export const ChevronsUpDownIcon = wrap(CaretUpDown);
export const ArrowLeftIcon      = wrap(ArrowLeft);
export const ArrowRightIcon     = wrap(ArrowRight);
export const ArrowUpRightIcon   = wrap(ArrowUpRight);

// ---------- Actions & Controls ----------
export const SearchIcon    = wrap(MagnifyingGlass);
export const PlusIcon      = wrap(Plus);
export const XIcon         = wrap(X);
export const SaveIcon      = wrap(FloppyDisk);
export const PaperclipIcon = wrap(Paperclip);
export const PrinterIcon   = wrap(Printer);
export const DownloadIcon  = wrap(DownloadSimple);
export const BanknoteIcon  = wrap(Money);
export const SendIcon      = wrap(PaperPlaneTilt);
export const PencilIcon    = wrap(PencilSimple);
export const GitMergeIcon  = wrap(GitMerge);
export const ScissorsIcon  = wrap(Scissors);
export const TrashIcon     = wrap(Trash);

// ---------- Users & Access ----------
export const UserPlusIcon    = wrap(UserPlus);
export const UserCheckIcon   = wrap(UserCheck);
export const UserIdIcon      = wrap(IdentificationCard);
export const ShieldCheckIcon = wrap(ShieldCheck);
export const SidebarSimpleIcon = wrap(SidebarSimple);

// ---------- Status & Alerts ----------
export const CheckIcon       = wrap(CheckCircle);
export const TickIcon        = wrap(Check);
export const AlertCircleIcon = wrap(WarningCircle);
export const InfoIcon        = wrap(Info);

// ---------- Service Categories ----------
export const Building2Icon   = wrap(Buildings);
export const BabyIcon        = wrap(Baby);
export const CarIcon         = wrap(Car);
export const ScrollTextIcon  = wrap(Certificate);
export const ReceiptIcon     = wrap(Receipt);
export const MapPinIcon      = wrap(MapPin);
