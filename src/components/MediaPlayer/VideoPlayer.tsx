import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import WatchStateManager from '../../managers/WatchStateManager';
import { MediaHandlerComponentProps } from './MediaHandlerComponentProps';

export const VideoPlayer = (props: MediaHandlerComponentProps) => {
  const [watchTime, setWatchTime] = useState(0);
  const ref = useRef<HTMLVideoElement>(null);

  const { media } = props;
  const onFinished = useCallback(props.onFinished, []);

  useLayoutEffect(() => {
    const effect = async () => {
      if (ref.current === null) return;
      const state = await WatchStateManager.getWatchState(
        media._id.toString()
      );
      if (state) {
        setWatchTime(state.time || 0);
        ref.current.currentTime = state.time;
      }

      ref.current.onended = () => {
        onFinished(media);
      };
    };
    effect();
  }, [media, onFinished]);

  const updateTime = async (time: number) => {
    if (time >= watchTime + 5) {
      setWatchTime(time);
      await WatchStateManager.setWatchTime(media._id.toString(), time);
    }
  };
  return media ? (
    <video
      className="video-player"
      id="video-player"
      controls
      src={`/api/media/play/${media._id.toString()}`}
      onTimeUpdate={(e) => updateTime(e.currentTarget.currentTime)}
      ref={ref}
    >
      {media && media.webvtt ? (
        <track
          label="English"
          kind="subtitles"
          srcLang="en"
          src={`/api/media/captions/${media._id.toString()}`}
          default
        />
      ) : null}
    </video>
  ) : null;
};
