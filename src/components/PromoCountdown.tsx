import { useState, useEffect } from 'react';
import { Clock, Zap, Gift, Timer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const PromoCountdown = () => {
  // Initial promo ends on Tuesday January 21, 2026 at 23:59:59 French time
  const initialPromoEnd = new Date('2026-01-21T23:59:59+01:00');
  const promoDurationMs = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
  
  const calculateCurrentPromoEnd = (): Date => {
    const now = new Date();
    const initialEndTime = initialPromoEnd.getTime();
    
    // If we haven't reached the initial promo end yet
    if (now.getTime() < initialEndTime) {
      return initialPromoEnd;
    }
    
    // Calculate how many complete 2-day cycles have passed since initial end
    const timeSinceInitialEnd = now.getTime() - initialEndTime;
    const completedCycles = Math.floor(timeSinceInitialEnd / promoDurationMs);
    
    // Next promo ends after (completedCycles + 1) * 2 days from initial end
    const nextPromoEnd = new Date(initialEndTime + (completedCycles + 1) * promoDurationMs);
    
    return nextPromoEnd;
  };
  
  const [promoEndDate, setPromoEndDate] = useState<Date>(calculateCurrentPromoEnd());
  
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const difference = promoEndDate.getTime() - now.getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  };
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // When countdown reaches 0, start a new 2-day cycle
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        // Calculate the new promo end date
        const newPromoEnd = calculateCurrentPromoEnd();
        setPromoEndDate(newPromoEnd);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [promoEndDate]);
  
  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
          <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
            {String(value).padStart(2, '0')}
          </span>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
      </div>
      <span className="text-xs mt-2 text-muted-foreground uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
  
  return (
    <div className="mt-8 relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 blur-3xl -z-10" />
      
      <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          <div className="absolute bottom-4 left-12 w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-6 right-16 w-1 h-1 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }} />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
          <Badge className="bg-red-500 text-white border-0 text-sm px-3 py-1 animate-pulse">
            🔥 OFFRE FLASH -200€
          </Badge>
          <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
        </div>
        
        {/* Promo Text */}
        <div className="text-center mb-6">
          <p className="text-lg sm:text-xl font-bold text-foreground">
            <span className="line-through text-muted-foreground text-base mr-2">700€</span>
            <span className="text-3xl sm:text-4xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              500€ TTC
            </span>
          </p>
          <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <Gift className="w-4 h-4 text-green-500" />
            Code promo automatique • Économise 200€
          </p>
        </div>
        
        {/* Countdown */}
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <Timer className="w-5 h-5 text-red-500 animate-pulse hidden sm:block" />
          <TimeBlock value={timeLeft.days} label="Jours" />
          <span className="text-2xl font-bold text-red-500 animate-pulse">:</span>
          <TimeBlock value={timeLeft.hours} label="Heures" />
          <span className="text-2xl font-bold text-orange-500 animate-pulse">:</span>
          <TimeBlock value={timeLeft.minutes} label="Min" />
          <span className="text-2xl font-bold text-yellow-500 animate-pulse">:</span>
          <TimeBlock value={timeLeft.seconds} label="Sec" />
          <Timer className="w-5 h-5 text-red-500 animate-pulse hidden sm:block" />
        </div>
        
        {/* Urgency text */}
        <p className="text-center mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          Offre limitée • <span className="font-semibold text-foreground">Se termine bientôt !</span>
        </p>
      </div>
    </div>
  );
};

export default PromoCountdown;
