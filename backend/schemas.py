from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ActionItemBase(BaseModel):
    text: str
    assignee: Optional[str] = None
    completed: bool = False

class ActionItemCreate(ActionItemBase):
    pass

class ActionItemResponse(ActionItemBase):
    id: int
    meeting_id: int
    class Config:
        from_attributes = True

class TranscriptSegmentBase(BaseModel):
    speaker: str
    start_time: float
    end_time: float
    text: str

class TranscriptSegmentCreate(TranscriptSegmentBase):
    pass

class TranscriptSegmentResponse(TranscriptSegmentBase):
    id: int
    meeting_id: int
    class Config:
        from_attributes = True

class MeetingBase(BaseModel):
    title: str
    participants: str
    audio_url: Optional[str] = None
    summary: Optional[str] = None
    topics: Optional[str] = None

class MeetingCreate(MeetingBase):
    transcript_raw: Optional[str] = None # Raw pasted text to parse automatically

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    participants: Optional[str] = None

class MeetingResponse(MeetingBase):
    id: int
    date: datetime
    duration_seconds: int
    action_items: List[ActionItemResponse] = []
    class Config:
        from_attributes = True

class MeetingDetailResponse(MeetingResponse):
    transcripts: List[TranscriptSegmentResponse] = []