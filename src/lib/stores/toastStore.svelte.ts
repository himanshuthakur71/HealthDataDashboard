// toast.ts

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}

export class ToastStore {
	toasts = $state<Toast[]>([]); // Strongly typed reactive state

	add(type: ToastType, message: string, duration: number = 10000) {
		const id = crypto.randomUUID();

		const newToast: Toast = {
			id,
			type,
			message,
			duration
		};

		this.toasts = [...this.toasts, newToast];

		// Auto-remove after duration (unless 0 means manual dismissal)
		if (duration !== 0) {
			setTimeout(() => this.remove(id), duration);
		}
	}

	remove(id: string) {
		this.toasts = this.toasts.filter((t) => t.id !== id); // 🔥 FIXED: must reassign
	}
}

// Export singleton instance
export const toastStore = new ToastStore();
