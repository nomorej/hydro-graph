import { getTimelineData, TimelineParameters, TimelineSegmentDate } from '../src'

export async function timelineData(
  from: TimelineSegmentDate,
  to: TimelineSegmentDate
): Promise<TimelineParameters> {
  return getTimelineData(new Date(from), new Date(to))
}
