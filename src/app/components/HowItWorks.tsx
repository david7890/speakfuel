export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Escucha la historia",
      description: "Audio nativo con historias cortas y entretenidas"
    },
    {
      number: "2", 
      title: "Repite y practica",
      description: "Imita la pronunciación y aprende naturalmente"
    },
    {
      number: "3",
      title: "Aplica en conversación", 
      description: "Usa lo aprendido en situaciones reales"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Título */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
          Cómo funciona en 3 pasos
        </h2>
        
        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Number */}
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 