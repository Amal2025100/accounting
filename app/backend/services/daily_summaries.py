import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.daily_summaries import Daily_summaries

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class Daily_summariesService:
    """Service layer for Daily_summaries operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Daily_summaries]:
        """Create a new daily_summaries"""
        try:
            obj = Daily_summaries(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created daily_summaries with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating daily_summaries: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Daily_summaries]:
        """Get daily_summaries by ID"""
        try:
            query = select(Daily_summaries).where(Daily_summaries.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching daily_summaries {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of daily_summariess"""
        try:
            query = select(Daily_summaries)
            count_query = select(func.count(Daily_summaries.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Daily_summaries, field):
                        query = query.where(getattr(Daily_summaries, field) == value)
                        count_query = count_query.where(getattr(Daily_summaries, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Daily_summaries, field_name):
                        query = query.order_by(getattr(Daily_summaries, field_name).desc())
                else:
                    if hasattr(Daily_summaries, sort):
                        query = query.order_by(getattr(Daily_summaries, sort))
            else:
                query = query.order_by(Daily_summaries.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching daily_summaries list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Daily_summaries]:
        """Update daily_summaries"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Daily_summaries {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated daily_summaries {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating daily_summaries {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete daily_summaries"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Daily_summaries {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted daily_summaries {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting daily_summaries {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Daily_summaries]:
        """Get daily_summaries by any field"""
        try:
            if not hasattr(Daily_summaries, field_name):
                raise ValueError(f"Field {field_name} does not exist on Daily_summaries")
            result = await self.db.execute(
                select(Daily_summaries).where(getattr(Daily_summaries, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching daily_summaries by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Daily_summaries]:
        """Get list of daily_summariess filtered by field"""
        try:
            if not hasattr(Daily_summaries, field_name):
                raise ValueError(f"Field {field_name} does not exist on Daily_summaries")
            result = await self.db.execute(
                select(Daily_summaries)
                .where(getattr(Daily_summaries, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Daily_summaries.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching daily_summariess by {field_name}: {str(e)}")
            raise