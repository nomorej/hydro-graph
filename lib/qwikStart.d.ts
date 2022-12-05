import { Parameters } from './core/ComplexGraph';
import { SceneParameters } from './core/Scene';
import { TimelineParameters } from './core/Timeline';
import { PhasesParameters } from './objects/Phase';
import { AirTemperatureParameters } from './graphs/AirTemperature';
import { PrecipitationParameters } from './graphs/Precipitation';
import { SnowIceParameters } from './graphs/SnowIce';
import { WaterLevelParameters } from './graphs/WaterLevel';
import { WaterTemperatureParameters } from './graphs/WaterTemperature';
import { WaterConsumptionParameters } from './graphs/WaterСonsumption';
import { IceRulerData } from './graphs/IceRuler/IceRuler';
export interface QwikStartData {
    airTemperature?: AirTemperatureParameters;
    precipitation?: PrecipitationParameters;
    waterTemperature?: WaterTemperatureParameters;
    waterlevel?: WaterLevelParameters;
    snowIce?: SnowIceParameters;
    iceRuler?: IceRulerData;
    waterСonsumption?: WaterConsumptionParameters;
    phases?: PhasesParameters;
}
export interface QwikStartParameters extends Pick<Parameters, 'wrapper' | 'font' | keyof SceneParameters> {
    leapYear?: boolean;
    timeline: TimelineParameters;
    data: QwikStartData;
}
export declare function qwikStart(parameters: QwikStartParameters): {
    recreate(parameters: QwikStartParameters, previousZoom?: boolean): void;
    destroy(): void;
};
