import { useEffect, useMemo, useState } from "react";
import { Bell, BellRing, Plus } from "lucide-react";
import { useReminders } from "./hooks/useReminders";
import { requestNotificationPermission } from "./utils/notifications";
import { formatCountdown } from "./utils/time";
import type { Reminder, ReminderInput } from "./types";
import { ReminderForm } from "./components/ReminderForm";
import { ReminderCard } from "./components/ReminderCard";
import { AlertModal } from "./components/AlertModal";
import { EmptyState } from "./components/EmptyState";
import { FilterBar, type Filter } from "./components/FilterBar";

export default function App() {
  const {
    reminders,
    now,
    alert: activeAlert,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    duplicateReminder,
    dismissAlert,
  } = useReminders();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "denied"
  );

  useEffect(() => {
    if (notifPerm === "default") {
      requestNotificationPermission().then(setNotifPerm);
    }
  }, [notifPerm]);

  const counts = useMemo(
    () => ({
      all: reminders.length,
      active: reminders.filter((r) => r.active).length,
      paused: reminders.filter((r) => !r.active).length,
    }),
    [reminders]
  );

  const filtered = useMemo(() => {
    if (filter === "active") return reminders.filter((r) => r.active);
    if (filter === "paused") return reminders.filter((r) => !r.active);
    return reminders;
  }, [reminders, filter]);

  const nextUp = useMemo(() => {
    const actives = reminders.filter((r) => r.active);
    if (actives.length === 0) return null;
    return actives.reduce((a, b) => (a.nextTrigger < b.nextTrigger ? a : b));
  }, [reminders]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (r: Reminder) => {
    setEditing(r);
    setFormOpen(true);
  };

  const handleSubmit = (input: ReminderInput) => {
    if (editing) {
      updateReminder(editing.id, input);
    } else {
      addReminder(input);
    }
  };

  const enableNotifications = async () => {
    const p = await requestNotificationPermission();
    setNotifPerm(p);

    if (p !== "granted") {
      window.alert("No se pudieron activar las notificaciones.");
    }
  };

  return (
    <main className="app-shell">
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />

      <div className="container">
        <header className="page-header fade-in">
          <div className="header-topline">
            <span>Bienestar personal</span>
            <div className="status-dot" title="Activo" />
          </div>

          <h1>
            Mis <span className="text-gradient">Recordatorios</span>
          </h1>

          <p>Pequeños rituales que sostienen tu día.</p>
        </header>

        <section className="stats-grid">
          <div className="glass stat-card">
            <p className="stat-label">Activos</p>
            <p className="stat-value">
              {counts.active}
              <span>/{counts.all}</span>
            </p>
          </div>

          <div className="glass stat-card">
            <p className="stat-label">Próximo</p>

            {nextUp ? (
              <div className="next-up">
                <span className="next-up-emoji">{nextUp.emoji}</span>
                <div>
                  <p className="next-up-time text-gradient">
                    {formatCountdown(nextUp.nextTrigger - now)}
                  </p>
                  <p className="next-up-name">{nextUp.name}</p>
                </div>
              </div>
            ) : (
              <p className="next-up-empty">Sin programados</p>
            )}
          </div>
        </section>

        {notifPerm !== "granted" && reminders.length > 0 && (
          <div className="glass notif-banner fade-in">
            <div className="notif-icon">
              <BellRing size={20} />
            </div>

            <div className="notif-copy">
              <p>Activá las notificaciones</p>
              <small>Para que te avise aunque cambies de pestaña.</small>
            </div>

            <button className="secondary-btn" onClick={enableNotifications}>
              Permitir
            </button>
          </div>
        )}

        <div className="toolbar">
          <FilterBar value={filter} onChange={setFilter} counts={counts} />

          <button className="primary-btn desktop-add" onClick={openCreate}>
            <Plus size={16} />
            Nuevo
          </button>
        </div>

        {reminders.length === 0 ? (
          <EmptyState onCreate={openCreate} />
        ) : filtered.length === 0 ? (
          <div className="glass empty-filter">
            <Bell size={32} />
            <p>No hay recordatorios en este filtro.</p>
          </div>
        ) : (
          <div className="reminders-list fade-in">
            {filtered.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                now={now}
                onToggle={() => toggleReminder(r.id)}
                onEdit={() => openEdit(r)}
                onDelete={() => deleteReminder(r.id)}
                onDuplicate={() => duplicateReminder(r.id)}
              />
            ))}
          </div>
        )}
      </div>

      <button className="fab" onClick={openCreate} aria-label="Nuevo recordatorio">
        <Plus size={24} />
      </button>

      <ReminderForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        onSubmit={handleSubmit}
      />

      <AlertModal alert={activeAlert} onDismiss={dismissAlert} />
    </main>
  );
}
