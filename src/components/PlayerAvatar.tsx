interface PlayerAvatarProps {
  alt: string;
  className?: string;
  imagePath: string;
  label?: string;
  title?: string;
}

export function PlayerAvatar({ alt, className = '', imagePath, label, title }: PlayerAvatarProps) {
  const fallbackLabel = label?.trim().charAt(0).toUpperCase() || '?';

  return (
    <span className={`relative inline-grid overflow-hidden bg-cyan/15 text-cyan ${className}`} title={title}>
      <span className="grid h-full w-full place-items-center text-sm font-black">{fallbackLabel}</span>
      <img
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
        src={imagePath}
      />
    </span>
  );
}
