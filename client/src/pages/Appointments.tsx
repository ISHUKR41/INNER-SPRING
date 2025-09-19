import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/layout/Header";
import CalendarView from "@/components/appointments/CalendarView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Video, 
  MapPin,
  Star,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Appointment, Counselor } from "@/types";

// Form validation schema
const appointmentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  studentId: z.string().min(1, "Student ID is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  sessionType: z.enum(["in-person", "video", "phone", "crisis"]),
  primaryConcern: z.string(),
  urgencyLevel: z.enum(["routine", "moderate", "high", "crisis"]),
  additionalInfo: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  consentReminders: z.boolean().default(false),
  agreeCancellationPolicy: z.boolean().refine(val => val === true, "You must agree to the cancellation policy")
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

/**
 * Appointments Page - Calendar booking system with counselor selection
 * Features real-time availability, form validation, and appointment management
 */
export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("book");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock user ID - in production would come from auth context
  const userId = "mock-user-id";

  // Fetch available counselors
  const { data: counselors, isLoading: counselorsLoading } = useQuery({
    queryKey: ["/api/counselors/available"],
  });

  // Fetch user's appointments
  const { data: userAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: [`/api/appointments/user/${userId}`],
    enabled: !!userId,
  });

  // Form setup
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      studentId: "",
      email: "",
      phone: "",
      sessionType: "video",
      primaryConcern: "",
      urgencyLevel: "routine",
      additionalInfo: "",
      isAnonymous: false,
      consentReminders: false,
      agreeCancellationPolicy: false,
    },
  });

  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      if (!selectedDate || !selectedTime || !selectedCounselor) {
        throw new Error("Please select date, time, and counselor");
      }

      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      appointmentDateTime.setHours(hours, minutes);

      const response = await apiRequest("POST", "/api/appointments", {
        userId,
        counselorId: selectedCounselor,
        dateTime: appointmentDateTime.toISOString(),
        sessionType: data.sessionType,
        primaryConcern: data.primaryConcern,
        urgencyLevel: data.urgencyLevel,
        additionalInfo: data.additionalInfo,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/appointments/user/${userId}`] });
      form.reset();
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedCounselor(null);
      setActiveTab("manage");
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully scheduled. You'll receive a confirmation email shortly.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed", 
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      const response = await apiRequest("DELETE", `/api/appointments/${appointmentId}`, {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/appointments/user/${userId}`] });
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Cancellation Failed",
        description: "Unable to cancel appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    bookAppointmentMutation.mutate(data);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointmentMutation.mutate(appointmentId);
    }
  };

  // Session type options
  const sessionTypes = [
    { value: "video", label: "Video Call", icon: Video, description: "Online session via secure video" },
    { value: "in-person", label: "In-Person", icon: MapPin, description: "Face-to-face at campus counseling center" },
    { value: "phone", label: "Phone Call", icon: Phone, description: "Audio-only phone consultation" },
    { value: "crisis", label: "Crisis Session", icon: AlertTriangle, description: "Immediate crisis intervention" },
  ];

  // Primary concern options
  const concernOptions = [
    "Anxiety and stress management",
    "Depression and mood issues", 
    "Academic pressure and performance",
    "Relationship and social issues",
    "Sleep and lifestyle problems",
    "Identity and self-esteem",
    "Trauma and difficult experiences",
    "General mental health check-in"
  ];

  // Urgency level options
  const urgencyOptions = [
    { value: "routine", label: "Routine (within 2 weeks)", color: "bg-green-100 text-green-800" },
    { value: "moderate", label: "Moderate (within 1 week)", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High Priority (within 3 days)", color: "bg-orange-100 text-orange-800" },
    { value: "crisis", label: "Crisis (same day)", color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 font-heading">Schedule Counseling Sessions</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Book confidential appointments with licensed mental health professionals at your convenience
            </p>
            <Alert className="max-w-md mx-auto mt-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                🔒 Your information remains completely confidential
              </AlertDescription>
            </Alert>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="book" data-testid="tab-book-appointment">Book New</TabsTrigger>
              <TabsTrigger value="manage" data-testid="tab-manage-appointments">My Appointments</TabsTrigger>
            </TabsList>

            {/* Book Appointment Tab */}
            <TabsContent value="book" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Calendar & Counselor Selection */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Counselor Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center font-heading">
                        <User className="mr-2" size={24} />
                        Choose Your Counselor
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {counselorsLoading ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="bg-muted h-32 rounded-lg"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                          {counselors?.map((counselor: Counselor) => (
                            <Card
                              key={counselor.id}
                              className={`cursor-pointer transition-all duration-200 ${
                                selectedCounselor === counselor.id 
                                  ? "border-primary bg-primary/5" 
                                  : "border-border hover:border-primary/50"
                              }`}
                              onClick={() => setSelectedCounselor(counselor.id)}
                              data-testid={`counselor-card-${counselor.id}`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                                    {counselor.name.charAt(0)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground">{counselor.name}</h3>
                                    <p className="text-sm text-muted-foreground">{counselor.credentials}</p>
                                    <div className="flex items-center mt-1">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Star 
                                            key={i} 
                                            size={12} 
                                            className={`${i < counselor.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                          />
                                        ))}
                                      </div>
                                      <span className="text-xs text-muted-foreground ml-2">({counselor.rating}/5)</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {counselor.specializations.slice(0, 2).map((spec, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">{spec}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Calendar Component */}
                  <CalendarView
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    selectedCounselor={selectedCounselor}
                    onDateSelect={setSelectedDate}
                    onTimeSelect={setSelectedTime}
                  />
                </div>

                {/* Booking Form */}
                <div>
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="font-heading">Book Your Session</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          {/* Personal Information */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-foreground">Personal Information</h4>
                            
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name *</FormLabel>
                                  <FormControl>
                                    <Input {...field} data-testid="input-first-name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name (Optional)</FormLabel>
                                  <FormControl>
                                    <Input {...field} data-testid="input-last-name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="studentId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Student ID *</FormLabel>
                                  <FormControl>
                                    <Input {...field} data-testid="input-student-id" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email *</FormLabel>
                                  <FormControl>
                                    <Input type="email" {...field} data-testid="input-email" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Session Details */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-foreground">Session Details</h4>
                            
                            <FormField
                              control={form.control}
                              name="sessionType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Session Type *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-session-type">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {sessionTypes.map((type) => {
                                        const IconComponent = type.icon;
                                        return (
                                          <SelectItem key={type.value} value={type.value}>
                                            <div className="flex items-center space-x-2">
                                              <IconComponent size={16} />
                                              <span>{type.label}</span>
                                            </div>
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="primaryConcern"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Primary Concern *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-primary-concern">
                                        <SelectValue placeholder="Select your main concern" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {concernOptions.map((concern) => (
                                        <SelectItem key={concern} value={concern}>
                                          {concern}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="urgencyLevel"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Urgency Level *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-urgency-level">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {urgencyOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          <Badge className={option.color} variant="secondary">
                                            {option.label}
                                          </Badge>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="additionalInfo"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Additional Information (Optional)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      {...field} 
                                      placeholder="Share anything you'd like your counselor to know beforehand"
                                      data-testid="textarea-additional-info"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Consent Checkboxes */}
                          <div className="space-y-3">
                            <FormField
                              control={form.control}
                              name="agreeCancellationPolicy"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      data-testid="checkbox-cancellation-policy"
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm">
                                      I agree to the cancellation policy *
                                    </FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full gradient-primary text-white"
                            disabled={bookAppointmentMutation.isPending || !selectedDate || !selectedTime || !selectedCounselor}
                            data-testid="button-schedule-appointment"
                          >
                            {bookAppointmentMutation.isPending ? "Scheduling..." : "Schedule My Appointment"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Manage Appointments Tab */}
            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Your Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointmentsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-muted h-24 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : userAppointments && userAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {userAppointments.map((appointment: Appointment) => (
                        <Card key={appointment.id} className="border">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Badge className={
                                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }>
                                    {appointment.status}
                                  </Badge>
                                  <Badge variant="outline">{appointment.sessionType}</Badge>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Calendar size={14} />
                                    <span>{new Date(appointment.dateTime).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock size={14} />
                                    <span>{new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                </div>
                                
                                <p className="text-sm text-muted-foreground">
                                  Primary concern: {appointment.primaryConcern}
                                </p>
                              </div>

                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" data-testid={`button-reschedule-${appointment.id}`}>
                                  <Edit size={14} className="mr-1" />
                                  Reschedule
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  disabled={cancelAppointmentMutation.isPending}
                                  data-testid={`button-cancel-${appointment.id}`}
                                >
                                  <Trash2 size={14} className="mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto text-muted-foreground mb-4" size={48} />
                      <p className="text-muted-foreground">No appointments scheduled</p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setActiveTab("book")}
                        data-testid="button-book-first-appointment"
                      >
                        Book Your First Appointment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
