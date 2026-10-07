from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

import models, schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fireflies Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/meetings", response_model=List[schemas.MeetingResponse])
def get_meetings(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Meeting)
    if search:
        query = query.filter(
            (models.Meeting.title.ilike(f"%{search}%")) |
            (models.Meeting.participants.ilike(f"%{search}%"))
        )
    return query.order_by(models.Meeting.date.desc()).all()

@app.get("/api/meetings/{meeting_id}", response_model=schemas.MeetingDetailResponse)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting

@app.post("/api/meetings", response_model=schemas.MeetingDetailResponse, status_code=status.HTTP_201_CREATED)
def create_meeting(payload: schemas.MeetingCreate, db: Session = Depends(get_db)):
    new_meeting = models.Meeting(
        title=payload.title,
        participants=payload.participants,
        audio_url=payload.audio_url or "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        summary=payload.summary or "Summary auto-generated from uploaded transcript notes.",
        topics=payload.topics or "General, Roadmap, Action Plan",
        date=datetime.utcnow(),
        duration_seconds=180
    )
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)

    # Auto-parse raw transcript into segments if provided
    if payload.transcript_raw:
        lines = [l.strip() for l in payload.transcript_raw.split("\n") if l.strip()]
        t_cursor = 0.0
        for idx, line in enumerate(lines):
            speaker = "Speaker 1" if idx % 2 == 0 else "Speaker 2"
            if ":" in line and len(line.split(":")[0]) < 20:
                parts = line.split(":", 1)
                speaker = parts[0].strip()
                line_text = parts[1].strip()
            else:
                line_text = line

            seg = models.TranscriptSegment(
                meeting_id=new_meeting.id,
                speaker=speaker,
                start_time=t_cursor,
                end_time=t_cursor + 15.0,
                text=line_text
            )
            t_cursor += 15.0
            db.add(seg)
    else:
        # Default sample transcript line
        seg = models.TranscriptSegment(
            meeting_id=new_meeting.id,
            speaker="Host",
            start_time=0.0,
            end_time=10.0,
            text="Welcome to the meeting. Let's discuss our upcoming deliverables."
        )
        db.add(seg)

    db.commit()
    db.refresh(new_meeting)
    return new_meeting

@app.patch("/api/meetings/{meeting_id}", response_model=schemas.MeetingResponse)
def update_meeting(meeting_id: int, payload: schemas.MeetingUpdate, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if payload.title is not None:
        meeting.title = payload.title
    if payload.participants is not None:
        meeting.participants = payload.participants
    db.commit()
    db.refresh(meeting)
    return meeting

@app.delete("/api/meetings/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    db.delete(meeting)
    db.commit()
    return None

# Action Items Endpoints
@app.post("/api/meetings/{meeting_id}/action-items", response_model=schemas.ActionItemResponse)
def add_action_item(meeting_id: int, item: schemas.ActionItemCreate, db: Session = Depends(get_db)):
    action = models.ActionItem(
        meeting_id=meeting_id,
        text=item.text,
        assignee=item.assignee,
        completed=item.completed
    )
    db.add(action)
    db.commit()
    db.refresh(action)
    return action

@app.patch("/api/action-items/{item_id}", response_model=schemas.ActionItemResponse)
def toggle_action_item(item_id: int, db: Session = Depends(get_db)):
    action = db.query(models.ActionItem).filter(models.ActionItem.id == item_id).first()
    if not action:
        raise HTTPException(status_code=404, detail="Action item not found")
    action.completed = not action.completed
    db.commit()
    db.refresh(action)
    return action