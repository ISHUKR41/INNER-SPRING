import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedCounselor: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}

/**
 * Calendar View Component - Interactive calendar for appointment booking
 * Features date selection, time slot availability, and counselor scheduling
 */
export default function CalendarView({
  selectedDate,
  selectedTime,
  selectedCounselor,
  onDateSelect,
  onTimeSelect
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // Generate time slots for appointment booking
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  // Fetch appointments for selected counselor and date range
  const { data: existingAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: [`/api/appointments/counselor/${selectedCounselor}`, currentMonth.toISOString()],
    enabled: !!selectedCounselor,
    queryFn: async () => {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const response = await fetch(
        `/api/appointments/counselor/${selectedCounselor}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      return await response.json();
    },
  });

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      // Check availability based on existing appointments
      const dayAppointments = existingAppointments?.filter((apt: any) => {
        const aptDate = new Date(apt.dateTime);
        return aptDate.toDateString() === date.toDateString();
      }) || [];
      
      const availableSlots = timeSlots.length - dayAppointments.length;
      const hasAvailability = availableSlots > 0 && !isPast && !isWeekend && isCurrentMonth;

      days.push({
        date,
        isCurrentMonth,
        isToday,
        isPast,
        isWeekend,
        isSelected,
        hasAvailability,
        availableSlots,
        appointments: dayAppointments
      });
    }
    
    return days;
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate || !existingAppointments) return timeSlots;
    
    const dayAppointments = existingAppointments.filter((apt: any) => {
      const aptDate = new Date(apt.dateTime);
      return aptDate.toDateString() === selectedDate.toDateString();
    });
    
    const bookedTimes = dayAppointments.map((apt: any) => {
      const aptDate = new Date(apt.dateTime);
      return aptDate.getHours().toString().padStart(2, '0') + ':' + 
             aptDate.getMinutes().toString().padStart(2, '0');
    });
    
    return timeSlots.filter(time => !bookedTimes.includes(time));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarDays = generateCalendarDays();
  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center font-heading">
            <CalendarIcon className="mr-2" size={24} />
            Select Date & Time
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={view === 'month' ? 'default' : 'outline'}
              onClick={() => setView('month')}
              data-testid="button-month-view"
            >
              Month
            </Button>
            <Button
              size="sm"
              variant={view === 'day' ? 'default' : 'outline'}
              onClick={() => setView('day')}
              data-testid="button-day-view"
            >
              Day
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {view === 'month' ? (
          <>
            {/* Month View */}
            <div className="space-y-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => navigateMonth('prev')}
                  data-testid="button-prev-month"
                >
                  <ChevronLeft size={16} />
                </Button>
                <h3 className="text-lg font-semibold">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => navigateMonth('next')}
                  data-testid="button-next-month"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={cn(
                      "h-12 p-1 relative",
                      !day.isCurrentMonth && "text-muted-foreground/50",
                      day.isToday && "ring-2 ring-primary",
                      day.isSelected && "bg-primary text-primary-foreground",
                      day.isPast && "opacity-50 cursor-not-allowed",
                      day.isWeekend && day.isCurrentMonth && "bg-muted/50",
                      !day.hasAvailability && day.isCurrentMonth && !day.isPast && "bg-red-50 text-red-500"
                    )}
                    disabled={!day.hasAvailability || day.isPast}
                    onClick={() => day.hasAvailability && onDateSelect(day.date)}
                    data-testid={`calendar-day-${day.date.getDate()}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-sm">{day.date.getDate()}</span>
                      {day.isCurrentMonth && !day.isPast && (
                        <div className="flex space-x-1 mt-1">
                          {day.hasAvailability ? (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          ) : !day.isWeekend ? (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-muted-foreground">Available</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-muted-foreground">Fully Booked</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-muted-foreground">Unavailable</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Day View - Time Slots
          <div className="space-y-4">
            {selectedDate ? (
              <>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {availableTimeSlots.length} slots available
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map(time => {
                    const isAvailable = availableTimeSlots.includes(time);
                    const isSelected = selectedTime === time;
                    
                    return (
                      <Button
                        key={time}
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "justify-center",
                          !isAvailable && "opacity-50 cursor-not-allowed",
                          isSelected && "bg-primary text-primary-foreground"
                        )}
                        disabled={!isAvailable}
                        onClick={() => isAvailable && onTimeSelect(time)}
                        data-testid={`time-slot-${time}`}
                      >
                        <Clock size={14} className="mr-1" />
                        {time}
                      </Button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>Please select a date first</p>
              </div>
            )}
          </div>
        )}

        {/* Selected Appointment Summary */}
        {selectedDate && selectedTime && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h4 className="font-medium text-foreground mb-2">Selected Appointment</h4>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <CalendarIcon size={14} className="text-primary" />
                  <span>{selectedDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={14} className="text-primary" />
                  <span>{selectedTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
