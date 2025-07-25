import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'gradient' | 'primary' | 'accent';
}

export const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className,
  variant = 'default' 
}: MetricCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-primary to-accent text-white border-none shadow-chart';
      case 'primary':
        return 'bg-primary text-primary-foreground border-none';
      case 'accent':
        return 'bg-accent text-accent-foreground border-none';
      default:
        return 'bg-card border-border hover:shadow-card transition-all duration-200';
    }
  };

  return (
    <Card className={cn(
      'relative overflow-hidden',
      getVariantStyles(),
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-sm font-medium",
              variant === 'default' ? 'text-muted-foreground' : 'text-current opacity-80'
            )}>
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                <span className={cn(
                  'font-medium',
                  trend.isPositive ? 'text-success' : 'text-danger',
                  variant !== 'default' && 'text-current opacity-80'
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className={cn(
                  variant === 'default' ? 'text-muted-foreground' : 'text-current opacity-60'
                )}>
                  vs last month
                </span>
              </div>
            )}
          </div>
          <div className={cn(
            'p-3 rounded-lg',
            variant === 'default' 
              ? 'bg-muted text-muted-foreground' 
              : 'bg-white/10 text-current'
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};