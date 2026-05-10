import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Phase } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMatchDate(dateStr: string): string {
  const date = new Date(dateStr)
  return format(date, "EEEE d 'de' MMMM · HH:mm", { locale: es })
}

export function formatMatchDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  return format(date, 'd MMM · HH:mm', { locale: es })
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  if (isPast(date)) {
    return formatDistanceToNow(date, { addSuffix: true, locale: es })
  }
  return formatDistanceToNow(date, { addSuffix: true, locale: es })
}

export function isMatchLocked(matchDate: string): boolean {
  return isPast(new Date(matchDate))
}

export function isMatchUpcoming(matchDate: string): boolean {
  return isFuture(new Date(matchDate))
}

export function getPhaseLabel(phase: Phase): string {
  const labels: Record<Phase, string> = {
    group_stage: 'Fase de Grupos',
    round_of_32: 'Ronda de 32',
    round_of_16: 'Octavos de Final',
    quarterfinal: 'Cuartos de Final',
    semifinal: 'Semifinal',
    third_place: 'Tercer Puesto',
    final: 'Final',
  }
  return labels[phase] ?? phase
}

export function getPhaseOrder(phase: Phase): number {
  const order: Record<Phase, number> = {
    group_stage: 1,
    round_of_32: 2,
    round_of_16: 3,
    quarterfinal: 4,
    semifinal: 5,
    third_place: 6,
    final: 7,
  }
  return order[phase] ?? 0
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

export function getFlagEmoji(teamName: string): string {
  const flags: Record<string, string> = {
    'Argentina': '🇦🇷', 'Australia': '🇦🇺', 'Austria': '🇦🇹',
    'Belgium': '🇧🇪', 'Brazil': '🇧🇷', 'Cameroon': '🇨🇲',
    'Canada': '🇨🇦', 'Chile': '🇨🇱', 'China PR': '🇨🇳',
    'Colombia': '🇨🇴', 'Croatia': '🇭🇷', 'Denmark': '🇩🇰',
    'Ecuador': '🇪🇨', 'Egypt': '🇪🇬', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'France': '🇫🇷', 'Germany': '🇩🇪', 'Ghana': '🇬🇭',
    'Honduras': '🇭🇳', 'Iran': '🇮🇷', 'Iraq': '🇮🇶',
    'Italy': '🇮🇹', 'Jamaica': '🇯🇲', 'Japan': '🇯🇵',
    'Jordan': '🇯🇴', 'Mexico': '🇲🇽', 'Morocco': '🇲🇦',
    'Netherlands': '🇳🇱', 'New Zealand': '🇳🇿', 'Nigeria': '🇳🇬',
    'Panama': '🇵🇦', 'Poland': '🇵🇱', 'Portugal': '🇵🇹',
    'Qatar': '🇶🇦', 'Saudi Arabia': '🇸🇦', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'Senegal': '🇸🇳', 'Serbia': '🇷🇸', 'South Africa': '🇿🇦',
    'South Korea': '🇰🇷', 'Spain': '🇪🇸', 'Switzerland': '🇨🇭',
    'Tunisia': '🇹🇳', 'Turkey': '🇹🇷', 'Uruguay': '🇺🇾',
    'USA': '🇺🇸', 'Venezuela': '🇻🇪', 'Algeria': '🇩🇿',
  }
  return flags[teamName] ?? '🏳️'
}
