import React from "react";
import { Link } from "react-router-dom";
import { MapPin, User, Eye, Calendar } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { formatCurrency } from "@/utils/formatters";

interface EquipmentCardProps {
  equipment: {
    _id: string;
    title: string;
    category: string;
    rentalPricePerDay: number;
    location: {
      city: string;
      state: string;
    };
    images: string[];
    status: "available" | "booked" | "pending";
    owner: {
      firstName: string;
      lastName: string;
    };
  };
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  const getStatusBadge = () => {
    switch (equipment.status) {
      case "available":
        return (
          <Badge variant="success" withDot>
            Available
          </Badge>
        );
      case "booked":
        return (
          <Badge variant="error" withDot>
            Booked
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" withDot>
            Pending
          </Badge>
        );
      default:
        return <Badge variant="default">{equipment.status}</Badge>;
    }
  };

  const imageUrl =
    equipment.images?.[0] ||
    "https://via.placeholder.com/400x300/2D5A27/FFFFFF?text=No+Image";

  return (
    <Card variant="interactive" className="h-full flex flex-col">
      <div className="relative aspect-video bg-neutral-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={equipment.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="primary">{equipment.category}</Badge>
        </div>
        <div className="absolute top-3 right-3">{getStatusBadge()}</div>
      </div>

      <Card.Body className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-neutral-800 text-lg line-clamp-1">
            {equipment.title}
          </h3>
        </div>

        <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          {equipment.location.city}, {equipment.location.state}
        </p>

        <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
          <User className="w-4 h-4 flex-shrink-0" />
          {equipment.owner.firstName} {equipment.owner.lastName}
        </p>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-xl font-bold text-primary-600">
            {formatCurrency(equipment.rentalPricePerDay)}
          </span>
          <span className="text-sm text-neutral-500">/ day</span>
        </div>
      </Card.Body>

      <Card.Footer>
        <Link to={`/equipment/${equipment._id}`} className="w-full">
          <Button variant="primary" fullWidth size="sm">
            View Details
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};
