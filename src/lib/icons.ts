import {
  Home, Users, MapPin, Map, Building2, Sprout, Newspaper, CalendarDays,
  Images, Briefcase, Wheat, Beef, Scissors, Fish, CookingPot, Mountain,
  CreditCard, FileText, MapPinned, HeartHandshake, Heart, Store,
  MessageSquareWarning, Recycle, TrendingUp, Laptop, Eye, Target,
  CheckCircle2, Clock, BadgeDollarSign,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Home, Users, MapPin, Map, Building2, Sprout, Newspaper, CalendarDays,
  Images, Briefcase, Wheat, Beef, Scissors, Fish, CookingPot, Mountain,
  CreditCard, FileText, MapPinned, HeartHandshake, Heart, Store,
  MessageSquareWarning, Recycle, TrendingUp, Laptop, Eye, Target,
  CheckCircle2, Clock, BadgeDollarSign,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Building2;
}

export const colorMap: Record<string, string> = {
  primary: 'from-primary-500 to-primary-700',
  secondary: 'from-secondary-500 to-secondary-700',
  accent: 'from-accent-500 to-accent-700',
};
