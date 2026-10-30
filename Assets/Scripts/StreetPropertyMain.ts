/**
 * StreetPropertyMain — owns building visibility, overlay flow, listing selection,
 * and interaction audio. It expects authored façade and UI references and must
 * not create visible text or UIKit components.
 */
import {StreetPropertyOverlayUI} from "./StreetPropertyOverlayUI"
import {STREET_PROPERTY_LISTINGS} from "./StreetPropertyListings"

const CLUSTER_EXPAND_SFX = requireAsset("../GeneratedSFX/ClusterExpand.wav") as AudioTrackAsset
const LISTING_OPEN_SFX = requireAsset("../GeneratedSFX/ListingOpen.wav") as AudioTrackAsset
const LISTING_CLOSE_SFX = requireAsset("../GeneratedSFX/ListingClose.wav") as AudioTrackAsset

enum OverlayState {
  Hidden,
  Collapsed,
  Expanded,
  Listing,
}

@component
export class StreetPropertyMain extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">StreetPropertyMain – building overlay controller</span>')
  @ui.separator
  @ui.group_start("References")
  @input
  @allowUndefined
  @hint("StreetPropertyOverlayUI component authored on the overlay root")
  overlayUI!: StreetPropertyOverlayUI

  @input
  @allowUndefined
  @hint("Solid façade stand-in used as the visibility target")
  buildingFacade!: SceneObject

  @input
  @allowUndefined
  @hint("World-tracked camera object used for view-cone checks")
  cameraObject!: SceneObject
  @ui.group_end

  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("Half-angle of the view cone in degrees")
  @widget(new SliderWidget(25, 80, 1))
  visibilityHalfAngleDeg: number = 55

  @input
  @hint("Maximum camera-to-building-center distance before the overlay hides")
  @widget(new SliderWidget(900, 2000, 25))
  maximumVisibleDistanceCm: number = 1400

  @input
  @hint("Draw all physics colliders for interaction debugging")
  debugColliders: boolean = false
  @ui.group_end

  private state: OverlayState = OverlayState.Hidden
  private expandAudio!: AudioComponent
  private openAudio!: AudioComponent
  private closeAudio!: AudioComponent

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      if (!this.overlayUI || !this.buildingFacade || !this.cameraObject) {
        console.error("[StreetPropertyMain] Required @input not wired: overlayUI/buildingFacade/cameraObject")
        return
      }

      this.expandAudio = this.makeAudio("StreetPropertyExpandAudio", CLUSTER_EXPAND_SFX)
      this.openAudio = this.makeAudio("StreetPropertyOpenAudio", LISTING_OPEN_SFX)
      this.closeAudio = this.makeAudio("StreetPropertyCloseAudio", LISTING_CLOSE_SFX)

      this.overlayUI.onClusterPressed.add(() => this.expandCluster())
      this.overlayUI.onListingPressed.add((index: number) => this.openListing(index))
      this.overlayUI.onClosePressed.add(() => this.closeListing())

      this.expandAudio.playbackMode = Audio.PlaybackMode.LowLatency
      this.openAudio.playbackMode = Audio.PlaybackMode.LowLatency
      this.closeAudio.playbackMode = Audio.PlaybackMode.LowLatency
      if (this.debugColliders) this.setColliderDebugAll(this.sceneObject, true)
      this.createEvent("LateUpdateEvent").bind(() => this.updateBuildingVisibility())
    })
  }

  private updateBuildingVisibility(): void {
    const cameraTransform = this.cameraObject.getTransform()
    const cameraPosition = cameraTransform.getWorldPosition()
    const buildingPosition = this.buildingFacade.getTransform().getWorldPosition()
    const toBuilding = buildingPosition.sub(cameraPosition)
    const distance = toBuilding.length
    const viewDirection = cameraTransform.back.normalize()
    const direction = distance > 0.001 ? toBuilding.uniformScale(1 / distance) : viewDirection
    const threshold = Math.cos(this.visibilityHalfAngleDeg * Math.PI / 180)
    const visible = distance <= this.maximumVisibleDistanceCm && viewDirection.dot(direction) >= threshold

    if (visible && this.state === OverlayState.Hidden) {
      this.state = OverlayState.Collapsed
      this.overlayUI.showCollapsed()
    } else if (!visible && this.state !== OverlayState.Hidden) {
      this.state = OverlayState.Hidden
      this.overlayUI.hideAll()
    }
  }

  private expandCluster(): void {
    if (this.state !== OverlayState.Collapsed) return
    this.state = OverlayState.Expanded
    this.overlayUI.showApartmentMarkers()
    this.expandAudio.play(1)
  }

  private openListing(index: number): void {
    if (this.state !== OverlayState.Expanded && this.state !== OverlayState.Listing) return
    const listing = STREET_PROPERTY_LISTINGS[index]
    if (!listing) return
    this.state = OverlayState.Listing
    this.overlayUI.showListing(index, listing)
    this.openAudio.play(1)
  }

  private closeListing(): void {
    if (this.state !== OverlayState.Listing) return
    this.state = OverlayState.Expanded
    this.overlayUI.hideListing()
    this.closeAudio.play(1)
  }

  private makeAudio(name: string, track: AudioTrackAsset): AudioComponent {
    const object = global.scene.createSceneObject(name)
    object.setParent(this.sceneObject)
    const audio = object.createComponent("Component.AudioComponent") as AudioComponent
    audio.audioTrack = track
    return audio
  }

  private setColliderDebugAll(object: SceneObject, enabled: boolean): void {
    const collider = object.getComponent("Physics.ColliderComponent") as ColliderComponent | null
    if (collider) collider.debugDrawEnabled = enabled
    const body = object.getComponent("Physics.BodyComponent") as ColliderComponent | null
    if (body) body.debugDrawEnabled = enabled
    for (let i = 0; i < object.getChildrenCount(); i++) {
      this.setColliderDebugAll(object.getChild(i), enabled)
    }
  }
}
