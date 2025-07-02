export default function Testimonials() {
  const testimonials = [
    {
      name: "María González",
      country: "México",
      review: "En 2 meses ya podía mantener conversaciones básicas. El método realmente funciona."
    },
    {
      name: "Carlos Rodríguez", 
      country: "Argentina",
      review: "Las historias son adictivas. Aprender inglés nunca había sido tan natural."
    },
    {
      name: "Ana Martínez",
      country: "Colombia", 
      review: "Perfecto para mi rutina diaria. 15 minutos al día y resultados increíbles."
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Título */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
          Lo que dicen nuestros estudiantes
        </h2>
        
        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4 italic">
                &ldquo;{testimonial.review}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 