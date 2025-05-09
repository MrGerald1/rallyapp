interface Testimonial {
  name: string
  location: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: "Chioma A.",
    location: "Lagos",
    quote: "Rally helped me discover hidden spots in Lagos I never knew existed!",
  },
  {
    name: "Emeka O.",
    location: "Abuja",
    quote: "I've made new friends and stepped out of my comfort zone. Best app ever!",
  },
  {
    name: "Ngozi K.",
    location: "Port Harcourt",
    quote: "My photography skills have improved so much since I started the daily challenges.",
  },
]

export function Testimonials() {
  return (
    <div className="mt-12 w-full">
      <h2 className="font-heading mb-6 text-xl font-semibold">What Nigerians are saying</h2>
      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="rounded-lg border-none bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-yellow-100" />
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-semibold">{testimonial.name}</p>
                  <span className="text-sm text-muted-foreground">• {testimonial.location}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{testimonial.quote}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
