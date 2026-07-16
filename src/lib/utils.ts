import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isPast, isFuture, type Locale } from 'date-fns'
import { es, enUS } from 'date-fns/locale'

const LOCALES: Record<string, Locale> = { es, en: enUS }

export type DateLang = 'es' | 'en'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function resolveLocale(lang: DateLang | string): Locale {
  return LOCALES[lang] ?? es
}

export function formatMatchDate(dateStr: string, lang: DateLang | string = 'es'): string {
  const date = new Date(dateStr)
  const locale = resolveLocale(lang)
  if (lang === 'en') {
    return format(date, "EEEE, MMMM d · h:mm a", { locale })
  }
  return format(date, "EEEE d 'de' MMMM · HH:mm", { locale })
}

export function formatMatchDateShort(dateStr: string, lang: DateLang | string = 'es'): string {
  const date = new Date(dateStr)
  const locale = resolveLocale(lang)
  if (lang === 'en') {
    return format(date, 'MMM d · h:mm a', { locale })
  }
  return format(date, 'd MMM · HH:mm', { locale })
}

export function formatRelativeTime(dateStr: string, lang: DateLang | string = 'es'): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: resolveLocale(lang) })
}

export function isMatchLocked(matchDate: string): boolean {
  return isPast(new Date(matchDate))
}

export function isMatchUpcoming(matchDate: string): boolean {
  return isFuture(new Date(matchDate))
}

export function calcPredictionPoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number,
): number {
  if (predictedHome === actualHome && predictedAway === actualAway) return 3
  const predictedWinner = Math.sign(predictedHome - predictedAway)
  const actualWinner = Math.sign(actualHome - actualAway)
  if (predictedWinner === actualWinner) return 1
  return 0
}

export function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const TEAM_FLAGS: Record<string, string> = {
  'Algeria': '🇩🇿', 'Argentina': '🇦🇷', 'Australia': '🇦🇺',
  'Austria': '🇦🇹', 'Belgium': '🇧🇪', 'Bosnia and Herzegovina': '🇧🇦',
  'Brazil': '🇧🇷', 'Cabo Verde': '🇨🇻', 'Canada': '🇨🇦',
  'Colombia': '🇨🇴', 'Congo DR': '🇨🇩', 'Croatia': '🇭🇷',
  'Curaçao': '🇨🇼', 'Czech Republic': '🇨🇿', 'Ecuador': '🇪🇨',
  'Egypt': '🇪🇬', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'France': '🇫🇷',
  'Germany': '🇩🇪', 'Ghana': '🇬🇭', 'Haiti': '🇭🇹',
  'Iran': '🇮🇷', 'Iraq': '🇮🇶', 'Ivory Coast': '🇨🇮',
  'Japan': '🇯🇵', 'Jordan': '🇯🇴', 'Mexico': '🇲🇽',
  'Morocco': '🇲🇦', 'Netherlands': '🇳🇱', 'New Zealand': '🇳🇿',
  'Norway': '🇳🇴', 'Panama': '🇵🇦', 'Paraguay': '🇵🇾',
  'Portugal': '🇵🇹', 'Qatar': '🇶🇦', 'Saudi Arabia': '🇸🇦',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Senegal': '🇸🇳', 'South Africa': '🇿🇦',
  'South Korea': '🇰🇷', 'Spain': '🇪🇸', 'Sweden': '🇸🇪',
  'Switzerland': '🇨🇭', 'Tunisia': '🇹🇳', 'Turkey': '🇹🇷',
  'Uruguay': '🇺🇾', 'USA': '🇺🇸', 'Uzbekistan': '🇺🇿',
}

export const WORLD_CUP_TEAMS = Object.keys(TEAM_FLAGS).sort((a, b) => a.localeCompare(b))

export function getFlagEmoji(teamName: string): string {
  return TEAM_FLAGS[teamName] ?? '🏳️'
}
