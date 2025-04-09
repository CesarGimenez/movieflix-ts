
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

interface SubscriptionPlansProps {
  onSubscribe: () => void;
}

const plans: SubscriptionPlan[] = [
  {
    id: "basico",
    name: "Basico",
    price: "$8.99",
    features: [
      "Calidad HD",
      "Ver en 1 dispositivo al mismo tiempo",
      "Pel culas y shows de TV ilimitados",
      "Cancelar en cualquier momento"
    ]
  },
  {
    id: "standard",
    name: "Standard",
    price: "$13.99",
    features: [
      "Full HD disponible",
      "Ver en 2 dispositivos al mismo tiempo",
      "Películas y programas de televisión ilimitados",
      "Cancelar en cualquier momento"
    ],
    popular: true
  },
  {
    id: "premium",
    name: "Premium",
    price: "$17.99",
    features: [
      "Disponible en Ultra HD",
      "Ver en 4 dispositivos al mismo tiempo",
      "Películas y programas de televisión ilimitados",
      "Cancelar en cualquier momento"
    ]
  }
];

const SubscriptionPlans = ({ onSubscribe }: SubscriptionPlansProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("standard");

  const handleSubscribe = () => {
    toast({
      title: "Suscripción exitosa",
      description: `Gracias por suscribirte al plan ${plans.find(p => p.id === selectedPlan)?.name}`,
      variant: "default",
    });
    onSubscribe();
  };

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`border rounded-md p-4 cursor-pointer transition-all ${
              selectedPlan === plan.id
                ? "border-netflix-red bg-gray-900"
                : "border-gray-700 hover:border-gray-500"
            } ${plan.popular ? "relative" : ""}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-netflix-red text-white text-xs py-1 px-2 rounded-full">
                Mas popular
              </div>
            )}
            <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold text-white mb-4">{plan.price}<span className="text-sm text-gray-400">/mes</span></p>
            
            <ul className="space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="h-4 w-4 text-netflix-red mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button 
          className="bg-netflix-red hover:bg-netflix-red/90 text-white w-full py-6"
          onClick={handleSubscribe}
        >
          Empieza ahora en {plans.find(p => p.id === selectedPlan)?.name}
        </Button>
      </div>
      
      <p className="text-center text-xs text-gray-400 mt-4">
        Puedes cancelar tu suscripción en cualquier momento.
      </p>
    </div>
  );
};

export default SubscriptionPlans;
