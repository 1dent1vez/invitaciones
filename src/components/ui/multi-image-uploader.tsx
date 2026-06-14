'use client';

import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { uploadImageAction } from '@/app/(admin)/admin/pedidos/[id]/editar/actions';

interface MultiImageUploaderProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages: number;
}

export function MultiImageUploader({ value = [], onChange, maxImages }: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const remainingSlots = maxImages - value.length;
    if (filesArray.length > remainingSlots) {
      alert(`Solo puedes subir hasta ${maxImages} imágenes en este paquete.`);
      return;
    }

    setUploading(true);
    const newUrls = [...value];

    for (const file of filesArray) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadImageAction(formData);
        if (res.success && res.data) {
          newUrls.push(res.data);
        } else {
          alert(res.error ?? 'No se pudo subir una de las imágenes.');
        }
      } catch {
        alert('No se pudo conectar al servidor para subir las imágenes.');
      }
    }

    onChange(newUrls);
    setUploading(false);
  };

  const removeImage = (indexToRemove: number) => {
    const newUrls = value.filter((_, idx) => idx !== indexToRemove);
    onChange(newUrls);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= value.length) return;
    const newUrls = [...value];
    const temp = newUrls[index];
    const targetVal = newUrls[targetIndex];
    if (temp !== undefined && targetVal !== undefined) {
      newUrls[index] = targetVal;
      newUrls[targetIndex] = temp;
      onChange(newUrls);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>Fotos de galería:</span>
        <span className="font-bold" data-testid="gallery-count">
          {value.length} de {maxImages}
        </span>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-lg border border-slate-800 overflow-hidden bg-slate-950 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Galería ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                <div className="flex justify-between w-full">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveImage(idx, 'up')}
                    className="p-1 bg-slate-900 rounded text-slate-300 hover:text-white disabled:opacity-30 text-xs font-bold"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={idx === value.length - 1}
                    onClick={() => moveImage(idx, 'down')}
                    className="p-1 bg-slate-900 rounded text-slate-300 hover:text-white disabled:opacity-30 text-xs font-bold"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="self-center p-1 bg-rose-600 hover:bg-rose-500 rounded text-white text-[10px] font-semibold flex items-center gap-0.5"
                  aria-label={`eliminar ${idx + 1}`}
                >
                  <X className="h-2.5 w-2.5" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length < maxImages && (
        <div className="border-2 border-dashed border-slate-800 hover:border-violet-500/50 hover:bg-violet-600/5 rounded-xl p-4 transition-all text-center flex flex-col items-center justify-center cursor-pointer group relative">
          <input
            type="file"
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            disabled={uploading}
            onChange={handleUpload}
          />
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-violet-400 mb-1" />
          ) : (
            <Upload className="h-5 w-5 text-slate-400 group-hover:text-violet-400 transition-colors mb-1" />
          )}
          <p className="text-xs font-semibold text-slate-300">
            {uploading ? 'Subiendo fotos...' : 'Subir fotos'}
          </p>
        </div>
      )}
    </div>
  );
}
