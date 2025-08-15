// src/pages/ModifyBooking/Tabs/ProfileTab.jsx
import { TabsContent } from '@radix-ui/react-tabs';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

export default function ProfileTab({
  user = {
    firstName: 'Ava',
    lastName: 'Patel',
    email: 'ava.patel@example.com',
    dob: '1994-06-18',
    contact: '+1 202 555 0133',
    avatarUrl: '',
  },
  onSave, // optional: (updated) => void
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const initials = useMemo(() => {
    const f = (form.firstName || '').trim()[0] || '';
    const l = (form.lastName || '').trim()[0] || '';
    return (f + l).toUpperCase();
  }, [form.firstName, form.lastName]);

  const onChange = (k) => (e) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleUpdate = () => setShowConfirm(true);

  const handleConfirm = () => {
    setShowConfirm(false);
    setEditing(false);
    onSave?.(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setForm(user); // revert to original
  };

  return (
    <TabsContent value="profile">
      <Wrap>
        <Card>
          <CardHeader>
            <Title>Profile</Title>
            <HeaderActions>
              {!editing ? (
                <Primary onClick={() => setEditing(true)}>Enable Edit</Primary>
              ) : (
                <>
                  <Ghost onClick={handleCancelEdit}>Cancel</Ghost>
                  <Primary onClick={handleUpdate}>Update</Primary>
                </>
              )}
            </HeaderActions>
          </CardHeader>

          <Grid>
            {/* Left: avatar */}
            <LeftPane>
              <AvatarBox>
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="Profile" />
                ) : (
                  <AvatarFallback>{initials || 'U'}</AvatarFallback>
                )}
              </AvatarBox>

              <SmallNote>Recommended: 320×320px PNG/JPG</SmallNote>
              {editing && (
                <SmallRow>
                  <MiniGhost as="label">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        setForm((s) => ({ ...s, avatarUrl: url }));
                      }}
                    />
                  </MiniGhost>
                  {form.avatarUrl && (
                    <MiniGhost
                      onClick={() => setForm((s) => ({ ...s, avatarUrl: '' }))}
                    >
                      Remove
                    </MiniGhost>
                  )}
                </SmallRow>
              )}
            </LeftPane>

            {/* Right: form */}
            <RightPane>
              <Fields>
                <Field>
                  <Label>First Name</Label>
                  <Input
                    placeholder="Enter first name"
                    value={form.firstName || ''}
                    onChange={onChange('firstName')}
                    disabled={!editing}
                  />
                </Field>
                <Field>
                  <Label>Last Name</Label>
                  <Input
                    placeholder="Enter last name"
                    value={form.lastName || ''}
                    onChange={onChange('lastName')}
                    disabled={!editing}
                  />
                </Field>

                <Field $span2>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={form.email || ''}
                    onChange={onChange('email')}
                    disabled={!editing}
                  />
                </Field>

                <Field>
                  <Label>DOB</Label>
                  <Input
                    type="date"
                    value={form.dob || ''}
                    onChange={onChange('dob')}
                    disabled={!editing}
                  />
                </Field>
                <Field>
                  <Label>Contact Number</Label>
                  <Input
                    type="tel"
                    placeholder="Enter number"
                    value={form.contact || ''}
                    onChange={onChange('contact')}
                    disabled={!editing}
                  />
                </Field>
              </Fields>
            </RightPane>
          </Grid>
        </Card>

        {/* Success pill */}
        {saved && <SavedPill>Profile updated</SavedPill>}

        {/* Confirm modal (not browser alert) */}
        {showConfirm && (
          <ConfirmOverlay onClick={() => setShowConfirm(false)}>
            <ConfirmCard onClick={(e) => e.stopPropagation()}>
              <ConfirmTitle>Save changes?</ConfirmTitle>
              <ConfirmSub>
                You’re about to update your profile details. Please confirm.
              </ConfirmSub>
              <ConfirmActions>
                <Ghost onClick={() => setShowConfirm(false)}>Not now</Ghost>
                <Primary onClick={handleConfirm}>Save</Primary>
              </ConfirmActions>
            </ConfirmCard>
          </ConfirmOverlay>
        )}
      </Wrap>
    </TabsContent>
  );
}

/* ============ styled ============ */

const Wrap = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
  padding: 5.5rem 1rem 5rem;
`;

const Card = styled.section`
  width: 100%;
  max-width: 980px;

  /* glassy + mild neumorphism vibe */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.65),
    rgba(255, 255, 255, 0.45)
  );
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  padding: 1.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardColor2};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.large};
  letter-spacing: 0.2px;
`;

const HeaderActions = styled.div`
  display: inline-flex;
  gap: 0.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 1.5rem;
  padding-top: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

/* Left */
const LeftPane = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AvatarBox = styled.div`
  width: 220px;
  height: 220px;
  border-radius: 18px;
  overflow: hidden;

  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.55),
    rgba(255, 255, 255, 0.35)
  );
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  display: grid;
  place-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    height: 220px;
  }
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 2rem;
  letter-spacing: 1px;
  background: radial-gradient(
      1200px 400px at -10% -10%,
      rgba(56, 132, 255, 0.15),
      transparent 40%
    ),
    radial-gradient(
      1000px 400px at 110% 110%,
      rgba(56, 132, 255, 0.12),
      transparent 40%
    ),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.35),
      rgba(255, 255, 255, 0.15)
    );
`;

const SmallNote = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const SmallRow = styled.div`
  display: inline-flex;
  gap: 0.5rem;
`;

const MiniGhost = styled.button`
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid ${({ theme }) => theme.colors.cardColor2};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`;

/* Right */
const RightPane = styled.div`
  display: flex;
  flex-direction: column;
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  ${({ $span2 }) =>
    $span2 &&
    `
    grid-column: span 2;
    @media (max-width:  ${(props) => props.theme.breakpoints.tablet}) {
      grid-column: span 1;
    }
  `}
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 0.9rem;
  border-radius: 14px;

  /* glassy input */
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.small};

  &:disabled {
    opacity: 0.85;
    background: rgba(255, 255, 255, 0.55);
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(56, 132, 255, 0.12);
  }
`;

/* Buttons */
const Primary = styled.button`
  padding: 10px 14px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  &:hover {
    opacity: 0.95;
  }
`;

const Ghost = styled.button`
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid ${({ theme }) => theme.colors.cardColor2};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`;

/* Confirm modal */
const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ConfirmCard = styled.div`
  width: 100%;
  max-width: 460px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.78)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  padding: 1.25rem;
  display: grid;
  gap: 0.75rem;
`;

const ConfirmTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const ConfirmSub = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 0.5rem;
`;

/* Saved pill */
const SavedPill = styled.div`
  position: fixed;
  right: 24px;
  bottom: 24px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(56, 132, 255, 0.95);
  color: #fff;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  box-shadow: 0 8px 24px rgba(56, 132, 255, 0.25);
  z-index: 1000;
`;
