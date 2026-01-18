import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn('bg-[#1A1A1A] border-[#2A2A2A] hover:shadow-lg transition-all duration-200', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#A1A1AA]">{title}</CardTitle>
        <Icon className="h-4 w-4 text-[#3B82F6]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {trend && (
          <p className={cn(
            'text-xs mt-1',
            trend.isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );
};