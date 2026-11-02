import { cn } from '@/lib/utils';
import AppLogoIcon from './app-logo-icon';

export function Wordmark({ className }: { className?: string }) {
    return (
        <span className={cn('font-display font-bold tracking-tight', className)}>
            <span className="text-brand-blue dark:text-sky-400">Ascende</span>
            <span className="text-brand-green">Net</span>
        </span>
    );
}

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white ring-1 ring-black/5">
                <AppLogoIcon className="size-7" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <Wordmark className="truncate text-base leading-none" />
                <span className="text-muted-foreground mt-1 truncate text-xs leading-none">Panel de gestión</span>
            </div>
        </>
    );
}
