import type { Doctor } from "@/data/types";
import { useTranslation } from "@/hooks/useTranslation";
import type { ImageProps } from "react-native";
import Animated, {
  Easing,
  SharedTransition,
  useReducedMotion,
} from "react-native-reanimated";

const photoTransition = SharedTransition.duration(500).easing(
  Easing.out(Easing.cubic),
);

export function DoctorPhoto({
  doctor,
  shared = true,
  ...props
}: Omit<ImageProps, "source"> & { doctor: Doctor; shared?: boolean }) {
  const { translate } = useTranslation();
  const reducedMotion = useReducedMotion();
  return (
    <Animated.Image
      {...props}
      accessibilityLabel={
        props.accessibilityLabel
          ? translate(props.accessibilityLabel)
          : undefined
      }
      source={{ uri: doctor.photoUrl }}
      fadeDuration={0}
      resizeMode="cover"
      sharedTransitionStyle={photoTransition}
      sharedTransitionTag={
        reducedMotion || !shared ? undefined : `doctor-photo-${doctor.id}`
      }
    />
  );
}
