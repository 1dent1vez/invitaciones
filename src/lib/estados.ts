export const ESTADO_INVITACION = {
  BORRADOR: 'BORRADOR',
  PUBLICADA: 'PUBLICADA',
  ARCHIVADA: 'ARCHIVADA',
} as const;

export type EstadoInvitacion = (typeof ESTADO_INVITACION)[keyof typeof ESTADO_INVITACION];
