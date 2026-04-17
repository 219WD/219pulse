import { Plus, Sparkles } from "lucide-react";

export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="empty-state glass">
      <div className="empty-icon">
        <Sparkles size={36} />
      </div>
      <h3>Sin recordatorios todavía</h3>
      <p>
        Creá tu primer ritual: agua, pausa, respirar, mirar lejos. Pequeños gestos,
        grandes cambios.
      </p>
      <button className="primary-btn" onClick={onCreate}>
        <Plus size={16} />
        Crear mi primer recordatorio
      </button>
    </div>
  );
}