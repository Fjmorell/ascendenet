import { cn } from '@/lib/utils';

export function Wordmark({ className }: { className?: string }) {
    return (
        <span className={cn('font-display font-bold tracking-tight', className)}>
            <span className="text-brand-blue">Ascende</span>
            <span className="text-brand-green">Net</span>
        </span>
    );
}
