// /src/pages/ModifyBooking/tabs/StayoviaCircleTab.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { TabsContent } from './TabsLayout';

export default function StayoviaCircleTab() {
  const [loading, setLoading] = useState(true);

  // Simulated API payload (replace with real data later)
  const [loyalty, setLoyalty] = useState({
    programName: 'Stayovia Circle',
    tier: 'Gold', // ← try "Platinum" to see bluish style
    // tier: 'Platinum', // ← try "Platinum" to see bluish style
    memberName: 'ABC XYZ',
    memberId: 'SC-482193',
    points: 25480,
    nextTier: 'Platinum',
    nextTierThreshold: 30000,
    since: '2023-04-12',
    logoUrl: '/brand/stayovia-logo.svg', // optional
    cardBgUrl: '', // optional background image
    theme: { primary: '#3864FF' }, // used as fallback
    lastSynced: new Date(),
  });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const addDemoPoints = () => {
    setLoyalty((prev) => {
      const add = Math.floor(Math.random() * 600) + 250;
      return {
        ...prev,
        points: Math.min(prev.points + add, prev.nextTierThreshold),
        lastSynced: new Date(),
      };
    });
  };

  return (
    <TabsContent value="circle">
      <PageWrap>
        {/* Decorative background behind the content */}
        <Decor aria-hidden="true">
          <Backdrop />
          <Dots />
          <BlobOne />
          <BlobTwo />
          <GlowTop />
          <GlowBottom />
        </Decor>

        <HeaderBar>
          <HeaderLeft>
            <Title>Stayovia Circle</Title>
            <Sub>Unlock perks, boost points, and enjoy member-only deals.</Sub>
          </HeaderLeft>

          <HeaderRight>
            <GhostSm
              type="button"
              onClick={addDemoPoints}
              aria-label="Add demo points"
            >
              + Add demo points
            </GhostSm>
          </HeaderRight>
        </HeaderBar>

        <CenterWrap>
          {loading ? <SkeletonCard /> : <LoyaltyCard data={loyalty} />}
        </CenterWrap>
      </PageWrap>
    </TabsContent>
  );
}

/* ============================== Card Component ============================== */

function LoyaltyCard({ data }) {
  const derived = getTierTheme(data.tier, data.theme?.primary || '#3864FF');

  const progress = useMemo(() => {
    const total = Math.max(1, data.nextTierThreshold || 1);
    const pct = Math.min(100, Math.round((data.points / total) * 100));
    const remaining = Math.max(0, total - data.points);
    return { pct, remaining, total };
  }, [data.points, data.nextTierThreshold]);
  return (
    <Card
      $primary={derived.primary}
      $bg={data.cardBgUrl}
      $foil={derived.foilOverlay}
    >
      <LinesOverlay
        $primary={derived.primary}
        $a1={derived.linesAlpha1}
        $a2={derived.linesAlpha2}
        aria-hidden="true"
      />
      {derived.showSheen && (
        <FoilSheen $tint={derived.sheenTint} aria-hidden="true" />
      )}
      {derived.metalGrain && (
        <MetalGrain $strength={derived.grainStrength} aria-hidden="true" />
      )}
      {derived.iridescence && <IridescentSweep aria-hidden="true" />}

      {/* Original content (unchanged sizing) */}
      <TopRow>
        <LeftTop>
          {data.logoUrl ? (
            <Logo src={data.logoUrl} alt={`${data.programName} logo`} />
          ) : (
            <LogoFallback />
          )}
          <Program>{data.programName}</Program>
        </LeftTop>

        <TierBadge
          $bg={derived.badgeBg}
          $border={derived.badgeBorder}
          $text={derived.badgeText}
        >
          {data.tier}
        </TierBadge>
      </TopRow>

      <MemberRow>
        <MemberName>{data.memberName}</MemberName>
        <IdWrap>
          <Label>Member ID</Label>
          <IdLine>
            <Mono>{data.memberId}</Mono>
            <CopyBtn
              type="button"
              onClick={() => navigator?.clipboard?.writeText?.(data.memberId)}
              title="Copy Member ID"
            >
              Copy
            </CopyBtn>
          </IdLine>
        </IdWrap>
      </MemberRow>

      <PointsArea>
        <Label>Points</Label>
        <PointsCounter value={data.points} />
        <SyncRow>
          <LiveDot aria-hidden />
          <span>Synced {timeAgo(data.lastSynced)}</span>
        </SyncRow>
      </PointsArea>

      <ProgressArea>
        <ProgressHeader>
          <span>
            Progress to <strong>{data.nextTier}</strong>
          </span>
          <small>
            {progress.remaining.toLocaleString()} left •{' '}
            {data.nextTierThreshold.toLocaleString()} total
          </small>
        </ProgressHeader>
        <Track>
          <Fill
            style={{ width: `${progress.pct}%` }}
            $primary={derived.primary}
          />
        </Track>
      </ProgressArea>

      <QuickRow>
        <QuickAction type="button" title="View membership QR (coming soon)">
          View QR
        </QuickAction>
        <QuickAction type="button" title="View transactions (coming soon)">
          Transactions
        </QuickAction>
        <QuickAction type="button" title="Benefits (coming soon)">
          Benefits
        </QuickAction>
      </QuickRow>

      <SinceRow>
        <small>Member since {data.since}</small>
      </SinceRow>
    </Card>
  );
}

/* ============================== Points Counter ============================== */

function PointsCounter({ value, duration = 650 }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const cur = Math.round(from + (to - from) * eased);
      setDisplay(cur);
      if (t < 1) requestAnimationFrame(step);
      else fromRef.current = to;
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  return <PointsValue>{display.toLocaleString()}</PointsValue>;
}

/* ============================== Helpers ============================== */

function timeAgo(date) {
  if (!date) return 'just now';
  const diff = Math.max(0, Date.now() - new Date(date).getTime());
  const s = Math.floor(diff / 1000);
  if (s < 10) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

/* tiny util for rgba from hex */
const withAlpha = (hex, alpha = 1) => {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  const h = hex.replace('#', '');
  const isShort = h.length === 3;
  const r = parseInt(isShort ? h[0] + h[0] : h.slice(0, 2), 16);
  const g = parseInt(isShort ? h[1] + h[1] : h.slice(2, 4), 16);
  const b = parseInt(isShort ? h[2] + h[2] : h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/* Tier theme derivation */
function getTierTheme(tier, fallbackPrimary = '#3864FF') {
  const t = (tier || '').toLowerCase();

  let primary = fallbackPrimary;
  let badgeBg = 'linear-gradient(135deg, #e2e8f0, #ffffff)';
  let badgeBorder = 'rgba(2,6,23,0.12)';
  let badgeText = '#111827';
  let foilOverlay = null;
  let linesAlpha1 = 0.08;
  let linesAlpha2 = 0.05;
  let showSheen = false;
  let sheenTint = 'rgba(255,255,255,0.65)';
  let metalGrain = false;
  let grainStrength = 0.55;
  let iridescence = false;

  if (t.includes('gold')) {
    primary = '#D4AF37';
    badgeBg = 'linear-gradient(135deg, #fff5cc, #f1d07a 60%, #e1b94f)';
    badgeBorder = 'rgba(212,175,55,0.55)';
    badgeText = '#7a5a00';
    linesAlpha1 = 0.12;
    linesAlpha2 = 0.08;
    showSheen = true;
    sheenTint = 'rgba(255, 248, 225, 0.75)';
    foilOverlay =
      'radial-gradient(120% 80% at 0% 0%, rgba(244,206,116,0.22), transparent 60%), ' +
      'radial-gradient(120% 80% at 100% 100%, rgba(255,223,128,0.18), transparent 60%)';
  } else if (t.includes('platinum')) {
    primary = '#7FA8FF';
    badgeBg = 'linear-gradient(135deg, #f7fbff 0%, #e8f0ff 55%, #d3e1ff 100%)';
    badgeBorder = 'rgba(140,170,220,0.55)';
    badgeText = '#0f2f78';
    linesAlpha1 = 0.13;
    linesAlpha2 = 0.09;
    showSheen = true;
    sheenTint = 'rgba(240, 246, 255, 0.8)';
    foilOverlay =
      'radial-gradient(120% 80% at 0% 0%, rgba(173,200,255,0.22), transparent 60%), ' +
      'radial-gradient(120% 80% at 100% 100%, rgba(205,214,255,0.24), transparent 60%)';
    metalGrain = true;
    grainStrength = 0.6;
    iridescence = true;
  } else if (t.includes('silver')) {
    primary = '#C0C6D9';
    badgeBg = 'linear-gradient(135deg, #f6f7fb, #e6e9f2 60%, #d4d9e6)';
    badgeBorder = 'rgba(120,126,150,0.4)';
    badgeText = '#2c2f38';
    linesAlpha1 = 0.09;
    linesAlpha2 = 0.06;
    showSheen = true;
    sheenTint = 'rgba(255,255,255,0.7)';
    foilOverlay =
      'radial-gradient(120% 80% at 0% 0%, rgba(200,206,226,0.16), transparent 60%), ' +
      'radial-gradient(120% 80% at 100% 100%, rgba(205,212,230,0.18), transparent 60%)';
  } else if (t.includes('bronze')) {
    primary = '#CD7F32';
    badgeBg = 'linear-gradient(135deg, #ffd9b8, #e9a46f 60%, #cd7f32)';
    badgeBorder = 'rgba(205,127,50,0.5)';
    badgeText = '#5f330a';
    linesAlpha1 = 0.11;
    linesAlpha2 = 0.07;
    showSheen = true;
    sheenTint = 'rgba(255,240,230,0.7)';
    foilOverlay =
      'radial-gradient(120% 80% at 0% 0%, rgba(255,193,130,0.18), transparent 60%), ' +
      'radial-gradient(120% 80% at 100% 100%, rgba(224,150,90,0.2), transparent 60%)';
  }

  return {
    primary,
    badgeBg,
    badgeBorder,
    badgeText,
    foilOverlay,
    linesAlpha1,
    linesAlpha2,
    showSheen,
    sheenTint,
    metalGrain,
    grainStrength,
    iridescence,
  };
}

/* ============================== Background Scene ============================== */

const floatSlow = keyframes`
  0%   { transform: translate3d(0, 0, 0) scale(1); }
  50%  { transform: translate3d(0, -12px, 0) scale(1.02); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
`;

const PageWrap = styled.section`
  position: relative;
  width: 100%;
  padding: 0 16rem 3rem 16rem;
  min-height: 60vh;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 1rem 2rem 1rem;
  }
`;

const Decor = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

const Backdrop = styled.div`
  position: absolute;
  inset: -20% -10% -10% -10%;
  background: linear-gradient(180deg, #f7fbff 0%, #ffffff 60%),
    radial-gradient(
      80rem 80rem at 5% 0%,
      rgba(56, 100, 255, 0.1),
      transparent 55%
    ),
    radial-gradient(
      64rem 64rem at 98% 100%,
      rgba(56, 100, 255, 0.12),
      transparent 55%
    );
`;

const Dots = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(2, 6, 23, 0.06) 1px, transparent 1px);
  background-size: 14px 14px;
  opacity: 0.5;
  mask-image: radial-gradient(
    70rem 70rem at 50% 40%,
    rgba(0, 0, 0, 0.9),
    rgba(0, 0, 0, 0) 70%
  );
`;

const BlobBase = styled.div`
  position: absolute;
  width: 520px;
  height: 520px;
  filter: blur(42px);
  opacity: 0.25;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${floatSlow} 18s ease-in-out infinite;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 360px;
    height: 360px;
    filter: blur(36px);
  }
`;

const BlobOne = styled(BlobBase)`
  top: -140px;
  left: -60px;
  background: radial-gradient(
    circle at 30% 30%,
    #60a5fa 0%,
    #93c5fd 30%,
    transparent 60%
  );
`;

const BlobTwo = styled(BlobBase)`
  bottom: -180px;
  right: -100px;
  background: radial-gradient(
    circle at 70% 70%,
    #c7d2fe 0%,
    #a5b4fc 28%,
    transparent 60%
  );
  animation-delay: 2s;
`;

const GlowTop = styled.div`
  position: absolute;
  top: -120px;
  left: 40%;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(56, 100, 255, 0.2), transparent 60%);
  filter: blur(24px);
  opacity: 0.35;
`;

const GlowBottom = styled.div`
  position: absolute;
  bottom: -160px;
  left: 10%;
  width: 520px;
  height: 520px;
  background: radial-gradient(
    circle,
    rgba(56, 100, 255, 0.16),
    transparent 60%
  );
  filter: blur(28px);
  opacity: 0.35;
`;

/* ============================== Header & Layout ============================== */

const HeaderBar = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 1rem;
  margin: 1.25rem 0 1.25rem 0;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const HeaderLeft = styled.div`
  display: grid;
  gap: 0.3rem;
`;

const HeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.heading || '#0f172a'};
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
`;

const Sub = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondaryText || '#475569'};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const GhostSm = styled.button`
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid rgba(2, 6, 23, 0.08);
  background: #fff;
  color: ${({ theme }) => theme.colors.primaryText || '#111827'};
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: rgba(2, 6, 23, 0.03);
  }
`;

const CenterWrap = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
`;

/* ============================== Card Styles ============================== */

const Card = styled.section`
  width: min(720px, 100%);
  border-radius: 20px;
  padding: 18px 18px 14px 18px;
  position: relative;
  overflow: hidden;

  color: ${({ theme }) => theme.colors.heading || '#0f172a'};
  background: radial-gradient(
      140% 120% at 0% 0%,
      ${({ $primary }) => $primary}12,
      transparent 56%
    ),
    radial-gradient(
      120% 120% at 100% 100%,
      ${({ $primary }) => $primary}16,
      transparent 48%
    ),
    ${({ $bg }) => ($bg ? `url(${$bg}) center/cover no-repeat,` : '')}
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.96),
        rgba(255, 255, 255, 0.9)
      );

  border: 1px solid rgba(2, 6, 23, 0.08);
  box-shadow: 0 14px 34px rgba(2, 6, 23, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);

  display: grid;
  gap: 14px;

  /* Foil color overlay per tier */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: ${({ $foil }) => $foil || 'transparent'};
    mask-image: radial-gradient(
        140% 100% at 20% 10%,
        rgba(0, 0, 0, 0.7),
        rgba(0, 0, 0, 0) 70%
      ),
      radial-gradient(
        120% 100% at 80% 90%,
        rgba(0, 0, 0, 0.7),
        rgba(0, 0, 0, 0) 70%
      );
    opacity: 0.65;
  }

  /* ensure content paints above overlays */
  > * {
    position: relative;
    z-index: 1;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const LeftTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Logo = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

const LogoFallback = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #e2e8f0, #ffffff);
  border: 1px solid rgba(2, 6, 23, 0.06);
`;

const Program = styled.h4`
  margin: 0;
  font-weight: 800;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.colors.heading || '#0f172a'};
  font-size: clamp(14px, 2.2vw, 16px);
`;

const TierBadge = styled.div`
  padding: 6px 10px;
  border-radius: 999px;
  background: ${({ $bg }) => $bg};
  color: ${({ $text }) => $text || '#111827'};
  font-weight: 800;
  font-size: 12px;
  border: 1px solid ${({ $border }) => $border || 'rgba(56, 100, 255, 0.18)'};
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.45);
`;

const MemberRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const MemberName = styled.div`
  font-size: clamp(16px, 3.6vw, 20px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.heading || '#0f172a'};
`;

const IdWrap = styled.div`
  display: grid;
  gap: 4px;
  justify-items: end;

  @media (max-width: 560px) {
    justify-items: start;
  }
`;

const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondaryText || '#475569'};
`;

const IdLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Mono = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    'Liberation Mono', 'Courier New', monospace;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryText || '#111827'};
`;

const CopyBtn = styled.button`
  padding: 4px 8px;
  border-radius: 10px;
  border: 1px solid rgba(2, 6, 23, 0.08);
  background: #fff;
  color: ${({ theme }) => theme.colors.primaryText || '#111827'};
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: rgba(2, 6, 23, 0.03);
  }
`;

const PointsArea = styled.div`
  display: grid;
  gap: 4px;
  align-content: start;
`;

const PointsValue = styled.div`
  font-weight: 900;
  font-size: clamp(28px, 6vw, 40px);
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.heading || '#0f172a'};
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1); opacity: 0.85; }
`;

const SyncRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondaryText || '#475569'};
`;

const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #16a34a;
  animation: ${pulse} 1.8s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ProgressArea = styled.div`
  display: grid;
  gap: 8px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondaryText || '#475569'};
  strong {
    color: ${({ theme }) => theme.colors.primaryText || '#111827'};
  }
`;

const Track = styled.div`
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(2, 6, 23, 0.06);
  border: 1px solid rgba(2, 6, 23, 0.08);
`;
const Fill = styled.div`
  height: 100%;
  background: ${({ $primary }) =>
    `linear-gradient(90deg, ${$primary}, ${withAlpha($primary, 0.67)})`};
  transition: width 420ms ease;
`;

const QuickRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const QuickAction = styled.button`
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid rgba(2, 6, 23, 0.08);
  background: #fff;
  color: ${({ theme }) => theme.colors.primaryText || '#111827'};
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: rgba(2, 6, 23, 0.03);
  }
`;

const SinceRow = styled.div`
  margin-top: -2px;
  color: ${({ theme }) => theme.colors.secondaryText || '#475569'};
`;

/* ============================== Skeleton ============================== */

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const SkeletonBase = styled.div`
  background: #f1f5f9;
  border-radius: 12px;
  height: 14px;
  width: 100%;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(2, 6, 23, 0.06);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #f1f5f900, #ffffff88, #f1f5f900);
    background-size: 300px 100%;
    animation: ${shimmer} 1.2s infinite;
  }
`;

function SkeletonCard() {
  return (
    <Card style={{ paddingBottom: 18 }}>
      <LinesOverlay $primary="#3864FF" aria-hidden="true" />

      <TopRow>
        <LeftTop>
          <LogoFallback />
          <SkeletonBase style={{ width: 140, height: 18, borderRadius: 8 }} />
        </LeftTop>
        <SkeletonBase style={{ width: 68 }} />
      </TopRow>

      <MemberRow>
        <SkeletonBase style={{ height: 22 }} />
        <div>
          <SkeletonBase style={{ width: 80, height: 12, marginBottom: 6 }} />
          <SkeletonBase style={{ width: 120, height: 16 }} />
        </div>
      </MemberRow>

      <div>
        <SkeletonBase style={{ width: 54, height: 12, marginBottom: 8 }} />
        <SkeletonBase style={{ height: 36, marginBottom: 8 }} />
        <SkeletonBase style={{ width: 120, height: 12 }} />
      </div>

      <div>
        <SkeletonBase style={{ width: 180, height: 12, marginBottom: 8 }} />
        <SkeletonBase style={{ height: 10 }} />
      </div>

      <QuickRow>
        <SkeletonBase style={{ width: 100, height: 32 }} />
        <SkeletonBase style={{ width: 130, height: 32 }} />
        <SkeletonBase style={{ width: 110, height: 32 }} />
      </QuickRow>

      <SkeletonBase style={{ width: 160, height: 12 }} />
    </Card>
  );
}

/* ============================== Lines & Sheen Overlays ============================== */

const LinesOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    /* subtle square grid */ linear-gradient(
      to right,
      rgba(2, 6, 23, 0.06) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(2, 6, 23, 0.06) 1px, transparent 1px),
    /* soft diagonal accents using brand */
      ${({ $primary, $a1 = 0.08 }) =>
        `repeating-linear-gradient(60deg, ${withAlpha(
          $primary,
          $a1
        )} 0 1px, transparent 1px 18px)`},
    ${({ $primary, $a2 = 0.05 }) =>
      `repeating-linear-gradient(-60deg, ${withAlpha(
        $primary,
        $a2
      )} 0 1px, transparent 1px 18px)`};
  background-size: 28px 28px, 28px 28px, auto, auto;
  mask-image: radial-gradient(
    120% 120% at 50% 40%,
    rgba(0, 0, 0, 0.95),
    rgba(0, 0, 0, 0) 75%
  );
  opacity: 0.6;
`;

const glide = keyframes`
  0%  { transform: translateX(-130%) rotate(12deg); }
  100%{ transform: translateX(130%) rotate(12deg); }
`;

const FoilSheen = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -10%;
    left: -20%;
    width: 40%;
    height: 140%;
    background: linear-gradient(
      100deg,
      transparent 0%,
      ${({ $tint }) => $tint || 'rgba(255,255,255,0.7)'} 35%,
      rgba(255, 255, 255, 0.9) 50%,
      ${({ $tint }) => $tint || 'rgba(255,255,255,0.7)'} 65%,
      transparent 100%
    );
    mix-blend-mode: screen;
    opacity: 0.35;
    border-radius: 24px;
    animation: ${glide} 8s linear infinite;
  }
`;
// fine brushed-metal grain
const MetalGrain = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: ${({ $strength = 0.5 }) => Math.max(0.2, Math.min(0.8, $strength))};

  background:
    /* horizontal micro-lines */ repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.18) 0 1px,
    rgba(170, 190, 220, 0.08) 1px 3px,
    rgba(255, 255, 255, 0.16) 3px 4px,
    rgba(150, 170, 210, 0.06) 4px 6px
  );
  mix-blend-mode: soft-light;
`;

// very light moving iridescent sweep (cool silver/blue with a whisper of violet)
const sweepAnim = keyframes`
  0%   { transform: translateX(-120%) rotate(8deg); }
  100% { transform: translateX(120%)  rotate(8deg); }
`;
const IridescentSweep = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -20%;
    left: -30%;
    width: 50%;
    height: 150%;
    border-radius: 24px;
    background: linear-gradient(
      100deg,
      rgba(117, 141, 223, 0) 0%,
      rgba(185, 205, 255, 0.4) 28%,
      rgba(230, 240, 255, 0.7) 48%,
      rgba(200, 210, 255, 0.42) 60%,
      rgba(186, 170, 255, 0.3) 72%,
      rgba(117, 141, 223, 0) 100%
    );
    mix-blend-mode: screen;
    animation: ${sweepAnim} 10s linear infinite;
    opacity: 0.35;
  }
`;
