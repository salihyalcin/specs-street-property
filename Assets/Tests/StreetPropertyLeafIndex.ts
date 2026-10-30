import {scenariosIndex} from "Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator"
import {ScenarioMetadata} from "Leaf.lspkg/Scenarios/scenario/ScenarioMetadata"
import {Criterion1BuildingScenario} from "./Criterion1BuildingScenario"
import {Criterion2VisibilityScenario} from "./Criterion2VisibilityScenario"
import {Criterion3ScatterScenario} from "./Criterion3ScatterScenario"
import {Criterion4ListingCardScenario} from "./Criterion4ListingCardScenario"
import {Criterion5CloseScenario} from "./Criterion5CloseScenario"

@component
export class StreetPropertyLeafIndex extends BaseScriptComponent {
  @scenariosIndex
  static readonly scenarios: ScenarioMetadata[] = [
    {id: "street_property_criterion_1_building", typename: Criterion1BuildingScenario.getTypeName()},
    {id: "street_property_criterion_2_visibility", typename: Criterion2VisibilityScenario.getTypeName()},
    {id: "street_property_criterion_3_scatter", typename: Criterion3ScatterScenario.getTypeName()},
    {id: "street_property_criterion_4_listing", typename: Criterion4ListingCardScenario.getTypeName()},
    {id: "street_property_criterion_5_close", typename: Criterion5CloseScenario.getTypeName()},
  ]
}
