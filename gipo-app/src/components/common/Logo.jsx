import logo from '../../assets/LogoGIPO.png'

/**
 * Drop your production mark in at src/assets/LogoGIPO.png — this
 * component is the only place the image path is referenced. The logo
 * now carries the whole brand on its own (no "GIPO" text is rendered
 * anywhere else), so it's sized generously wherever it appears.
 *
 * Pass `glow` to wrap it in the rotating "fusion" halo used on the
 * post-auth loading screen — a soft ring of the ribbon colors
 * swirling behind the mark.
 */
export default function Logo({ size = 48, glow = false, className = '' }) {
  if (!glow) {
    return (
      <img
        src={logo}
        alt="GIPO — Garbage In, Prompt Out"
        width={size}
        height={size}
        className={className}
        style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0 }}
      />
    )
  }

  const haloSize = size * 2.1
  return (
    <span
      className={`gipo-logo-fusion ${className}`}
      style={{
        width: haloSize,
        height: haloSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <span className="gipo-logo-fusion__halo" />
      <img
        src={logo}
        alt="GIPO — Garbage In, Prompt Out"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain', position: 'relative', zIndex: 1 }}
      />
    </span>
  )
}
